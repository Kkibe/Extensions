const headingInput = document.getElementById("todoHeadingInput");
const headingDesc = document.getElementById("todoHeadingDesc");
const headingLabel = document.getElementById("todoHeadingLabel");
const showModalBtn = document.getElementById("showModalBtn");

const addBtn = document.getElementById("todoAddBtn");
const cancelBtn = document.getElementById("todoCancelBtn");

const backdrop = document.querySelector(".backdrop");
const modalAdd = document.querySelector(".modalAdd");

//list of todos;
const todos = [];

startApp();

//=====================================================
        //Initial Setup stuff
//=====================================================

//initial setup
function startApp(){
    backdrop.addEventListener("click", backDropCloseHandler);
    showModalBtn.addEventListener("click", modalShowHandler);

    //setting up default theme color
    const themeColor = localStorage.getItem("themeColor");
    if(themeColor){
        document.documentElement.style.setProperty("--theme-color",themeColor);
    }

    themeChangeHandler();

    addBtn.addEventListener("click", addTodoHandler);

    addLabelListeners();

    dragListenerHandler();
};

//=====================================================
        //label listener, used for filtering todos
//=====================================================

//adding listener to listen for  filtering based in label;
function addLabelListeners(){
    const allLabel = document.getElementById("allLabel");
    const workLabel = document.getElementById("workLabel");
    const homeLabel = document.getElementById("homeLabel");
    const generalLabel = document.getElementById("generalLabel");
    allLabel.addEventListener("click", renderTodosByLabel.bind(null, "all"));
    workLabel.addEventListener("click", renderTodosByLabel.bind(null, "work"));
    generalLabel.addEventListener(
        "click",
        renderTodosByLabel.bind(null, "general")
    );
    homeLabel.addEventListener("click", renderTodosByLabel.bind(null, "home"));
};

//=====================================================
        //theme handler functions to change and store
//=====================================================

//theme change handler
function themeChangeHandler(){
    const closeThemePalleteBtn = document.getElementById("closeThemePalleteBtn");
    closeThemePalleteBtn.addEventListener("click",(e) => {
        console.log(e.target.parentElement)
        e.target.parentElement.style.display = "none";
    })
    const themeChangeBtn = document.getElementById("themeChangeBtn");
    themeChangeBtn.addEventListener("click",() => {
        const colorPallete = document.querySelector(".color-pallete");
        colorPallete.style.display = "flex";
    })

    const themeButtons= document.querySelectorAll(".color-pallete span").forEach(el => {
        el.addEventListener("click",e => {
            const themeColor = e.target.style.background;
            localStorage.setItem("themeColor",themeColor);
            document.documentElement.style.setProperty("--theme-color",themeColor);
        });
    })
}

//=====================================================
        //drag listener for removal on drag
//=====================================================

//drag listener
function dragListenerHandler(){
    //for drag listener
    const container = document.querySelector(".container");
    container.addEventListener("drop", (event) => {
        console.log(3);
        console.log(
            document.getElementById(id).querySelector("button:last-of-type")
        );
        document.getElementById(id).querySelector("button:last-of-type").click();

        event.preventDefault();
    });


    container.addEventListener("dragover", (event) => {
        const todosElement = document.getElementById("todos");

        if (event.dataTransfer.types[0] === "text/plain" && event.relatedTarget !== todosElement) {
            event.preventDefault();
        }
    });
}

//=====================================================
        //funcitons to add and edit todos
//=====================================================

//add a single Todo to the list
function addTodoHandler(e){
    e.preventDefault();
    const title = headingInput.value;
    const description = headingDesc.value;
    const label = headingLabel.value;
    const id = Math.random();
    const todo = {
        title,
        description,
        id,
        label
    };

    todos.push(todo);
    const todoElement = renderSingleTodo(title, description, id, label);
    renderTodoToDOM(todoElement);
    modalCloseHandler();
};


//fucntion to handle the edit fucntionlaity
function editTodoHandler(id){
    const index = todos.findIndex((p) => p.id === id);
    modalShowHandler();
    const todo = todos[index];
    headingInput.value = todo.title;
    headingDesc.value = todo.description;
    let addBtn = document.getElementById("todoAddBtn");
    let editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    addBtn.replaceWith(editBtn);
    editBtn.addEventListener("click", (event) => {
        event.preventDefault();
        console.log(index);
        const updatedTitle = headingInput.value;
        const updatedDesc = headingDesc.value;
        todos[index].title = updatedTitle;
        todos[index].description = updatedDesc;
        const todoList = document.getElementById("todos");
        todoList.children[index].querySelector(
            ".todo__heading"
        ).textContent = updatedTitle;
        todoList.children[index].querySelector(
            ".todo__description"
        ).textContent = updatedDesc;
        backDropCloseHandler();
        editBtn.replaceWith(addBtn);
        addBtn.textContent = "Add";
        addBtn.addEventListener("click", addTodoHandler);
        return;
    });
};


//=====================================================
        //functions to add Todo to DOM, creating,editing 
//=====================================================

//util function to add a element to todos DOM;
function renderTodoToDOM(element){
    const todosElement = document.getElementById("todos");
    todosElement.append(element);
};

//util funciton for making a single todo element, add various event listeners to it
function renderSingleTodo(title, description, id, label){
    const todo = document.createElement("div");
    let labelClass = ["label"];
    let buttonClass;
    if (label == "general") {
        labelClass.push("label--general");
        buttonClass = "btn--general";
    }
    if (label == "home") {
        labelClass.push("label--home");
        buttonClass = "btn--home";
    }
    if (label == "work") {
        labelClass.push("label--work");
        buttonClass = "btn--work";
    }
    labelClass = labelClass.join(" ");
    todo.className = "todo";
    todo.id = id + "";
    todo.setAttribute("draggable", true);
    todo.innerHTML = `
        <h3 class="todo__heading">${title}</h3>
        <p class="todo__description">${description}</p>
        <span class="${labelClass}">${label}</span>
        <div class="todo__buttons">
        <button class="${buttonClass}">Edit</button>
        <button class="${buttonClass}">Delete</button>
        </div>
        `;

    todo.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("text/plain", id);
        event.dataTransfer.effectAllowed = "move";
        console.log("asda");
    });

    let delBtn = todo.querySelector(".todo__buttons button:last-of-type");

    delBtn.addEventListener("click", deleteTodoHandler.bind(null, id));

    let editBtn = todo.querySelector(".todo__buttons button");

    editBtn.addEventListener("click", editTodoHandler.bind(null, id));
    return todo;
};


//filtering the DOM by label
function renderTodosByLabel(label){
    const todosElement = document.getElementById("todos");
    todosElement.innerHTML = "";
    let tempArray = todos;
    if (label !== "all") {
        tempArray = todos.filter((p) => p.label === label);
    }

    tempArray.forEach((el) => {
        const todo = renderSingleTodo(el.title, el.description, el.id, el.label);
        renderTodoToDOM(todo);
    });
};

//function to delete a todo
function deleteTodoHandler(id){
    const index = todos.findIndex((p) => p.id === id);
    todos.splice(index, 1);

    const todoList = document.getElementById("todos");
    todoList.children[index].remove();
};


//=====================================================
        //dunction for the basic UI handling
//=====================================================

//fucntion to close the addFrom modal
function modalShowHandler(){
    modalAdd.style.display = "block";
    backdrop.style.display = "block";
};

//function to close the backdrop
function backDropCloseHandler(){
    backdrop.style.display = "none";
    modalCloseHandler();
};


//funciton to close a modal
function modalCloseHandler(){
    headingInput.value = "";
    headingDesc.value = "";
    modalAdd.style.display = "none";
    backdrop.style.display = "none";
};