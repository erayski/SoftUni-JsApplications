import { getAllTopics } from "../api/data.js";
import { e } from '../dom.js';
import { showTopicPage } from "./topic.js";

const sectionHome = document.getElementById('homePage');
const sectionTopics = document.getElementById('topicPage');

sectionTopics.remove();

export async function showHomePage() {
    const main = document.querySelector('main');
    main.replaceChildren();

    main.appendChild(sectionHome);
    
    sectionTopics.replaceChildren();
    const data = await getAllTopics();

    const fragment = document.createDocumentFragment();
    Object.values(data).map(createDivEl)
        .forEach(post => fragment.appendChild(post));
        
    sectionTopics.appendChild(fragment);
    main.appendChild(sectionTopics);
}

// create each topic in database
function createDivEl(post) {
    const topicDiv = e('div', { className: 'topic-container' },
        e('div', { className: 'topic-name-wrapper' },
            e('div', { className: 'topic-name' },
                e('a', { href: '#', className: 'normal' },
                    e('h2', { id: post._id }, post.title)
                ),
                e('div', { className: 'columns' },
                    e('div', {},
                        e('p', {}, 'Date: ',
                            e('time', {}, post.time)
                        ),
                        e('div', { className: 'nick-name' },
                            e('p', {}, 'Username: ',
                                e('span', {}, post.username)
                            )
                        )
                    )
                )
            )
        )
    )
    topicDiv.addEventListener('click', openTopic);
    return topicDiv;
}

// change page view by clicked topic
async function openTopic(event) {
    if (event.target.tagName == 'H2') {
        const topicId = event.target.id;
        const main = document.querySelector('main');
        main.replaceChildren()
        main.appendChild(e('h2', {}, 'Loading...'));

        showTopicPage(topicId, sectionHome);
    }
}

/*  Example of topic on home page:
<div class="topic-container">
    <div class="topic-name-wrapper">
        <div class="topic-name">
            <a href="#" class="normal">
                <h2>Angular 10</h2>
            </a>
            <div class="columns">
                <div>
                    <p>Date: <time>2020-10-10T12:08:28.451Z</time></p>
                    <div class="nick-name">
                        <p>Username: <span>David</span></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
*/