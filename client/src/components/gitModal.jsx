import React, { Component } from 'react';
import Modal from 'react-modal';
import './gitModal.css'

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    },
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.8)'
    }
};

const isValidGitUrl = url => {
    if (!url) {
        return false
    }
    if (!url.includes("https://github.com/")) {
        return false
    }
    // TODO: more validation
    return true
}

class GitModal extends Component {
    constructor(props) {
        super();

        this.state = {
            modalIsOpen: true,
            gitURLProvided: false,
            prompt: "Please enter your GitHub repo",
            hint: "i.e. https://github.com/username/repo",
        };

        this.setGit = props.setGit

        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    openModal() {
        this.setState({ modalIsOpen: true });
    }

    afterOpenModal() {
    }

    closeModal() {
        this.setState({ modalIsOpen: false });
    }

    onSubmit(event) {
        event.preventDefault();

        let gitURL = document.getElementById("giturl").value;
        if (!isValidGitUrl(gitURL)) {
            console.error("invalid Git URL")
            this.setState({ hint: "invalid GitHub repo URL"})
            return;
        }
        this.setGit(gitURL)
        this.closeModal()
    }

    render() {
        return (
            <div>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    contentLabel="GitHub URL prompt"
                    style={customStyles}>
                    <div className="gitmodal-title">
                        <h2>{this.state.prompt}</h2>
                        <h5 className="gitmodal-hint">{this.state.hint}</h5>
                    </div>
                    <form onSubmit={this.onSubmit} className="gitmodal-form">
                        <input id="giturl" type="text" placeholder="https://github.com/jjcollinge/tfexample" />
                        <button type="submit"
                        className="btn gitmodal-form-submit">OK</button>
                    </form>
                </Modal>
            </div>
        );
    }
}

export default GitModal;