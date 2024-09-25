const TodoData = [] // var kosong 
const EVENT_CUSTOM = 'CUSTOMEVENT'  //STRING CUSTOM EVENT  

const SAVE_EVENT = 'save_event' //tracking debugging
const storageKey = 'TO_DO_APPS_WEB' //KEY STORAGE WEB 


// mendeteksi browser support dengan local storage atau tidak 
function islocalstorage(){
  if (typeof Storage === 'undefined'){
    alert('Browser yang anda gunakan tidak support local storage')
    return false; //jika iya kembalikan false 
  }

  // lalu ketika dipanggil akan melempar true 
  return true; 
}






// MEMBUAT ID RANDOM 
function generateid(){
  return +new Date()
}

// MENGEMBALIKAN INPUT DATA MENJADI OBJEK 
function toObjek(id,title,time,progres){
  return  {
    id,
    title,
    time,
    progres
  }
}

// PENGAMBILAN VALUE SETELAH INPUT 
function addTodo(){
  const title = document.getElementById('title').value;
  const time = document.getElementById('date').value;

  const idRandom = generateid()
  const OutputDataObjek = toObjek(idRandom,title,time,false)
  TodoData.push(OutputDataObjek)

  document.dispatchEvent(new Event(EVENT_CUSTOM))

}


function findTodo(objek){
  for (const item of TodoData){
    if (item.id === objek){
      return item;
    }
  }
  return null
}

function findTodoIndex(objek){
  for (const index in TodoData){
    if (TodoData[index].id === objek){
      return index
    } 
  }
  return -1 
}


// FUNGSI HAPUS TUGAS 
function removetaskfromcomplete(objek){
  const todoTarget = findTodoIndex(objek)

  if (todoTarget === -1) return;
  
  TodoData.splice(todoTarget,1)
  document.dispatchEvent(new Event(EVENT_CUSTOM))
  saveData();
}

// FUNGSI TAMBAH TUGAS 
function addtasktocomplete(objek){
  const todoTarget = findTodo(objek)

  if (todoTarget == null) return;

  todoTarget.progres = true;
  document.dispatchEvent(new Event(EVENT_CUSTOM))
  saveData();
}

// FUNGSI UNDO TUGAS 
function undotaskfromcomplete(objek){
  const todotarget = findTodo(objek);

  if (todotarget == null)return;
  todotarget.progres = false;
  document.dispatchEvent(new Event(EVENT_CUSTOM))
  saveData();
}

// FUNGSI MEMBUAT ELEMENT KETIKA MENAMBAH TUGAS 
function createElementTodo(objek){
  const textTitle = document.createElement('h2')
  textTitle.innerText = objek.title;

  const textTime = document.createElement('p')
  textTime.innerText = objek.time

  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(textTitle, textTime);

  const container = document.createElement('div');
  container.classList.add('item', 'shadow');
  container.append(textContainer);
  container.setAttribute('id', `todo-${objek.id}`);


  // MANIPULASI BUTTON SELESAI HAPUS DAN UNDO KETIKA DI CLICK 
  if (objek.progres){
    const UndoButton = document.createElement('button');
    UndoButton.classList.add('undo-button')


    UndoButton.addEventListener('click', function (){
      undotaskfromcomplete(objek.id)
    });

    trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');

    trashButton.addEventListener('click', function(){
      removetaskfromcomplete(objek.id)
    })

    container.append(UndoButton,trashButton)

  }else {
    const checkButton = document.createElement('button');
    checkButton.classList.add('check-button')

    checkButton.addEventListener('click', function(){
      addtasktocomplete(objek.id)
    })
    container.append(checkButton)

  }
  return container;
}


document.addEventListener(EVENT_CUSTOM, function() {
  const nocompleteTodo = document.getElementById('todos');
  nocompleteTodo.innerHTML = '';

  const progresComplete = document.getElementById('completed-todos');
  progresComplete.innerHTML = '';

  for (const item of TodoData){
    const todoelement = createElementTodo(item)

    if (!item.progres){
      nocompleteTodo.append(todoelement);

    }else{
      progresComplete.append(todoelement)
    }

  }
})


document.addEventListener('DOMContentLoaded', function (){
  
  const selectForm = document.getElementById('form');
    
  selectForm.addEventListener('submit', function(event){
    event.preventDefault(); 
    addTodo() 

    
  })
  
})

// menjalankan EVENT CUSTOM YANG DIBUAT 
document.addEventListener(SAVE_EVENT, function(){
  console.log(menjalankan)
})

// FUNGSI LOCAL STORAGE 
function saveData(){
  if (islocalstorage){
    const uptoJson = JSON.stringify(TodoData)

    localStorage.setItem(storageKey, uptoJson)

    document.dispatchEvent(new Event(SAVE_EVENT))
  }  
}


