package main

import (
	"encoding/json"
	"fmt"
	"github.com/hashicorp/terraform/configs"
	"os"
)

type tfvar struct {
	Required    bool
	Name        string
	Type        string
	Default     interface{}
	Description string
}

type tfoutput struct {
	Name  string
	Value interface{}
}

func main() {
	parser := configs.NewParser(nil)
	// dir, _ := os.Getwd()
	dir := "/home/lawrence/source/tf/azure-aks-terraform"

	// Check the folder has some terraform in it!
	isModuleFolder := parser.IsConfigDir(dir)
	if !isModuleFolder {
		fmt.Printf("Provided folder doesn't contain terraform files")
		os.Exit(1)
		return
	}

	// Parse the terraform with the HCL parser
	module, diags := parser.LoadConfigDir(dir)
	if diags != nil && diags.HasErrors() {
		fmt.Printf("Found errors parsing terraform directory: %+v", diags)
		os.Exit(1)
	}

	cleanedVariableMap := make(map[string]interface{}, len(module.Variables))
	for k, variable := range module.Variables {
		var defaultValue interface{}
		var valueTypeFriendly string

		if !variable.Default.IsNull() {
			valueTypeFriendly = variable.Default.Type().FriendlyName()
			switch valueTypeFriendly {
			case "string":
				defaultValue = variable.Default.AsString()
			case "list of string":
				defaultValue = variable.Default.AsValueSlice() // doesn't work investigate marshalling when I can pull down the code for ctyjson
			default:
				fmt.Println(fmt.Sprintf("Unsupported variable type in tf exporter: %v", valueTypeFriendly))
			}
		}

		cleanedVariableMap[k] = tfvar{
			Required:    variable.Default.IsNull(),
			Name:        k,
			Type:        valueTypeFriendly,
			Default:     defaultValue,
			Description: variable.Description,
		}
	}

	jsonBytes, _ := json.Marshal(cleanedVariableMap)

	fmt.Println(string(jsonBytes))

	return
}
