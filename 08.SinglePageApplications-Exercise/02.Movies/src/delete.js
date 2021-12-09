import { showHome } from './home.js';
// delete movie from database by id
// return to home page
export async function showDelete(id) {
    const userData = JSON.parse(sessionStorage.getItem('userData'));

    const confirmed = confirm('Are you sure you want to delete this movie ?');
    if (confirmed) {
        try {
            const res = await fetch('http://localhost:3030/data/movies/' + id, {
                method: 'delete',
                headers: {
                    'X-Authorization': userData.token
                },
            });
    
            if (res.ok == false) {
                const error = await res.json();
                throw new Error(error.message);
            }
    
            showHome();
        } catch (err) {
            alert(err.message);
        }
    }
}