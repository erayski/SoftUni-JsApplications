import * as api from './api.js';

export async function getAllTopics() {
    return api.get('/jsonstore/collections/myboard/posts');
}

export async function getById(id) {
    return api.get('/jsonstore/collections/myboard/posts/' + id);
}

export async function createTopic(topic) {
    return api.post('/jsonstore/collections/myboard/posts', topic);
}

export async function getAllComments() {
    return api.get('/jsonstore/collections/myboard/comments');
}

export async function createComment(comment) {
    return api.post('/jsonstore/collections/myboard/comments', comment);
}