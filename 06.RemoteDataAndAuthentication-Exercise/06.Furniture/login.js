window.addEventListener('DOMContentLoaded', () => {
    const formR = document.getElementById('register');
    formR.addEventListener('submit', onRegister);

    const formL = document.getElementById('login');
    formL.addEventListener('submit', onLogin);
})

async function onRegister(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const email = formData.get('email');
    const password = formData.get('password');
    const rePass = formData.get('rePass');

    if(email == '' || password == '' || rePass == ''){
        alert('All fields must be full!');
        return;
    } else if( password != rePass){
        alert('Password don\'t match!');
        return;
    }
    
    try {
        const res = await fetch('http://localhost:3030/users/register', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })

        if (res.ok != true) {
            const error = await res.json();
            throw new Error(error.message)
        }

        const data = await res.json();
        userData = {
            email: data.email,
            id: data._id,
            token: data.accessToken
        }

        sessionStorage.setItem('userData', JSON.stringify(userData));
        alert('welcome');
        window.location = '/homeLogged.html';
    } catch (err) {
        alert(err.message);
    }
}


async function onLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const email = formData.get('email');
    const password = formData.get('password');

    if(email == '' || password == '' ){
        alert('All fields must be full!');
        return;
    }
    
    try {
        const res = await fetch('http://localhost:3030/users/login', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })

        if (res.ok != true) {
            const error = await res.json();
            throw new Error(error.message)
        }

        const data = await res.json();
        userData = {
            email: data.email,
            id: data._id,
            token: data.accessToken
        }

        sessionStorage.setItem('userData', JSON.stringify(userData));
        alert('welcome');
        window.location = '/homeLogged.html';
    } catch (err) {
        alert(err.message);
    }
}