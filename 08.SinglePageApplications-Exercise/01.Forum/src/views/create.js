import { createTopic } from "../api/data.js";
import { showHomePage } from "./home.js";

export async function addNewTopic(event) {
    event.preventDefault();
    const postBtn = event.target
    const form = postBtn.parentElement.parentElement;
    const formData = new FormData(form);

    const title = formData.get('topicName').trim();
    const username = formData.get('username').trim();
    const postText = formData.get('postText').trim();
    const time = new Date().toLocaleString();

    if (title == "" || username == '' || postText == '') {
        return alert('All fields are required !')
    }

    createTopic({ title, username, postText, time });

    form.reset();
    showHomePage();
}