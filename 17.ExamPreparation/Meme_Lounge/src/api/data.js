import * as api from './api.js'

export const login = api.login;
export const register = api.register;
export const logout = api.logout;

// window.getAllMemes = getAllMemes

const endpoints = {
    getAllMemes: '/data/memes?sortBy=_createdOn%20desc',
    createMeme: '/data/memes',
    getMemeById: '/data/memes/',
    deleteMeme: '/data/memes/',
    editMeme: '/data/memes/'
}

export async function getAllMemes() {
    return api.get(endpoints.getAllMemes);
}

export async function getMemeById(id) {
    return api.get(endpoints.getMemeById + id); 
}

export async function getMyMemes(userId){
    return api.get(`/data/memes?where=_ownerId%3D%22${userId}%22&sortBy=_createdOn%20desc`);
}

export async function createMeme(meme) {
    return api.post(endpoints.createMeme, meme);
}

export async function editMeme(id, meme) {
    return api.put(endpoints.editMeme + id, meme);
}

export async function deleteMeme(id) {
    return api.del(endpoints.deleteMeme + id);
}