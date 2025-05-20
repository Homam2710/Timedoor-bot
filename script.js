const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;
const API_KEY = "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";
const inputInitHeight = chatInput.scrollHeight;


const createChatli = (message , classname) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat" , classname);
    let chatContent = classname === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
} 
const generateResponse = (incomingChatLi) =>{
    const API_url = "https://openrouter.ai/api/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector("p");
    if(!userMessage) return;

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${API_KEY}`

        },
        body: JSON.stringify({
            model: "meta-llama/llama-4-scout:free",
            messages: [{ role: "user", content: userMessage }],
            
        })
    }
    fetch(API_url, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content;
    }).catch((error) => {
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong. Please try again.";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}


const handleChat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;
    chatInput.value = "" ;
    chatInput.style.height = `${inputInitHeight}px`;


    chatbox.appendChild(createChatli(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout( () => {
        const incomingChatLi = createChatli("Thinking...", "incoming")
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    },600);
}

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter" && !e.shiftkey && window.innerWidth > 800 ){
        e.preventDefault();
        handleChat();    
    }
});


sendChatBtn.addEventListener("click" , handleChat);
chatbotCloseBtn.addEventListener("click",() => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click",() => document.body.classList.toggle("show-chatbot"));



