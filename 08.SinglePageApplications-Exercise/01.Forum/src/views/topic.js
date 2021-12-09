import { getById, getAllComments, createComment } from "../api/data.js";
import { e } from '../dom.js';

let topic = null
let home = null;

export async function showTopicPage(idTopic, sectionHome) {
    let id = idTopic;
    home = sectionHome;

    topic = await getById(id);

    const main = document.querySelector('main');
    main.replaceChildren();
    main.appendChild(e('h2', {}, topic.title));

    main.appendChild(createTitle( topic.username, topic.postText, topic.time));

    const fragment = document.createDocumentFragment();
    const comments = await getAllComments();
    Object.values(comments).map(c => {
        if (c.id == topic._id) {
            fragment.appendChild(createCommentDiv( c.username, c.time, c.text));
        }
        });

    document.querySelector('main .comment').appendChild(fragment);
    main.appendChild(addCommentSection());
}


function addCommentSection() {
    const addCommentFields = e('div', { className: 'answer-comment' },
        e('p', {}, e('span', {}, 'currentUser'), ' comments:'),
        e('div', { className: 'answer' },
            e('form', {},
                e('textarea', { name: 'postText', id: 'comment', cols: '30', rows: '10' }),
                e('div', {},
                    e('label', { for: 'username' }, 'Username', e('span', { className: 'red' }), '*'),
                    e('input', { type: 'text', name: 'username', id: 'username' })
                ),
                e('button', {}, 'Post')
            )
        )
    );

    addCommentFields.querySelector('form').addEventListener('submit', onSubmit);
    return addCommentFields;
}
/* Example of add comment fields:
<div class="answer-comment">
    <p><span>currentUser</span> comment:</p>
    <div class="answer">
        <form>
            <textarea name="postText" id="comment" cols="30" rows="10"></textarea>
            <div>
                <label for="username">Username <span class="red">*</span></label>
                <input type="text" name="username" id="username">
            </div>
            <button>Post</button>
        </form>
    </div>
</div>
*/


// add new comment, display it and clear input fields
async function onSubmit(event) {
    event.preventDefault();
    const form = event.target
    const formData = new FormData(form);
    const text = formData.get('postText');
    const username = formData.get('username');
    const time = new Date().toLocaleString();

    if (text == "" || username == '' ) {
        return alert('All fields are required !')
    }

    createComment({ id: topic._id, text, username, time});
    document.querySelector('main .comment').appendChild(createCommentDiv(username,time,text))
    form.reset();
}


function createTitle( username, postText, time) {
    const divTopic = e('div', { className: 'comment' },
        e('div', { className: 'header' },
            e('img', { src: './static/profile.png', alt: 'avatar' }),
            e('p', {},
                e('span', {}, username), ' posted on ', e('time', {}, time)),
            e('p', { className: 'post-content' }, postText)
        )
    );
    return divTopic;
}
/* Example of open post view:
<div class="comment">
    <div class="header">
        <img src="./static/profile.png" alt="avatar">
        <p><span>David</span> posted on <time>2020-10-10 12: 08: 28</time></p>

        <p class ="post-content">Lorem ipsum dolor sit amet consectetur adipisicing elit.Iure facere sint
        dolorem quam,
        accusantium ipsa veniam laudantium inventore aut, tenetur quibusdam doloribus.Incidunt odio
        nostrum facilis ipsum dolorem deserunt illum?</p>
    </div>
</div>
*/


function createCommentDiv(username, time, text) {
    const divComment = e('div', { className: 'user-comment' },
        e('div', { className: 'topic-name-wrapper' },
            e('div', { className: 'topic-name' },
                e('p', {}, e('strong', {}, username), ' commented on ', e('time', {}, time)),
                e('div', { className: 'post-content' },
                    e('p', {}, text)
                )
            )
        )
    );
    return divComment;
}
/* Example of comment:
<div id="user-comment">
    <div class="topic-name-wrapper">
        <div class="topic-name">
            <p><strong>Daniel</strong> commented on <time>3/15/2021, 12:39:02 AM</time></p>
            <div class="post-content">
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure facere sint
                    dolorem quam.</p>
            </div>
        </div>
    </div>
</div>
*/