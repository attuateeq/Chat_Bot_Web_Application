(function() {
    const app = document.querySelector(".app");
    const socket = io();
    let lname;
    app.querySelector(".join-screen #join-user").addEventListener("click", function() {
        let username = app.querySelector(".join-screen #username").value;
        if (username.length == 0) {
            return;
        }
        socket.emit("newUser", username);
        uname = username;
        app.querySelector(".join-screen").classList.remove("active");
        app.querySelector(".chat-screen").classList.add("active");
    })
    app.querySelector(".chat-screen #send-message").addEventListener("click", function() {
        let message = app.querySelector(".chat-screen #message-input").value;
        if (message.length == 0)
            return;
        renderMessage("my", {
            username: uname,
            text: message
        })
        socket.emit("chat", {
            username: uname,
            text: message
        })
        app.querySelector(".chat-screen #message-input").value = "";
    })
    app.querySelector(".chat-screen #exit-chat").addEventListener("click", function() {
        socket.emit("exituser", uname);
        window.location.href = window.location.href;
    })
    socket.on("update", function(update) {
        renderMessage("update", update);
    });
    socket.on("chat", function(message) {
        renderMessage("other", message);
    });

    function renderMessage(type, message) {
        let messageContainer = app.querySelector(".chat-screen .messages");
        if (type == "my") {
            let el = document.createElement("div");
            el.setAttribute("class", "message my-message");
            el.innerHTML = `
               <div>
                    <div class="name">You</div>
                    <div class="text">${message.text}</div>
               </div>
            `;
            messageContainer.appendChild(el);
        } else if (type == "other") {
            let el = document.createElement("div");
            el.setAttribute("class", "message other-message");
            el.innerHTML = `
               <div>
                    <div class="name">${message.username}</div>
                    <div class="text">${message.text}</div>
               </div>
            `;
            messageContainer.appendChild(el);
        } else if (type == "update") {
            let el = document.createElement("div");
            el.setAttribute("class", "update");
            el.innerText = message;
            messageContainer.appendChild(el);
        }
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }
    const buttons = document.querySelectorAll('button');
    let textField = document.getElementById("textField")
    textField.designMode = "On";
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', () => {
            let cmd = buttons[i].getAttribute('data-cmd');
            if (buttons[i].name === "active") {
                buttons[i].classList.toggle('active');
            }
            if (cmd === "insertImage" || cmd === "createLink") {
                let url = prompt("Enter link here: ", "");
                textField.document.execCommand(cmd, false, url);
                if (cmd === "insertImage") {
                    const imgs = textField.documnet.querySelectorAll('img');
                    imgs.forEach(item => {
                        item.style.maxWidth = "500px";
                    })

                } else {
                    const links = textField.document.querySelectorAll('a');
                    links.forEach(item => {
                        item.target = "_blank";
                        item.addEventListener('mouseover', () => {
                            textField.document.designMode = "Off";
                        });
                        item.addEventListener('mouseover', () => {
                            textField.document.designMode = "On";
                        });
                    })
                }
            } else {
                textField.document.execCommand(cmd, false, null);
            }
            if (cmd === "showCode") {
                const textBody = textField.document.querySelector('body');
                if (show) {
                    textBody.innerHTML = textBody.textContent;
                    show = false;
                } else {
                    textBody.textContent = textBody.innerHTML;
                    show = true;
                }
            }
        })
    }
})();