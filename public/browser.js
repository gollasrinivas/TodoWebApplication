function addItem(ele)
{
    return `
    <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
<span class="item-text">${ele.item}</span>
    <div>
      <button data-id="${ele._id}" class="edit-me btn btn-secondary btn-sm mr-1" name="edit">Edit</button>
      <button data-id="${ele._id}" class="delete-me btn btn-danger btn-sm" name="delete">Delete</button>
    </div>
  </li>`
}
//run intially
let intialHTML=items.map(function(item){
    return addItem(item)
}).join('')
document.getElementById("list-items").insertAdjacentHTML("beforeend",intialHTML)


//insert items
let inputField=document.getElementById("input-item")

let Myform=document.getElementById("myForm")
Myform.addEventListener("submit",(e)=>{
e.preventDefault()
//let inputField=document.getElementById("input-item")

axios.post('/create-item',{text:inputField.value}).then(function(res){
    document.getElementById("list-items").insertAdjacentHTML("beforeend",addItem(res.data))
    inputField.value=""
    inputField.focus()

}).catch(()=>{
    console.log("try again later...")
})

})


document.addEventListener("click",function(e){

//delete feature
if(e.target.name=="delete")
{
    if(confirm("do u really want to delete the item permanently!!")){
        axios.post('/delete-item',{id:e.target.getAttribute("data-id")}).then(()=>{
            e.target.parentElement.parentElement.remove()
        }).catch(()=>{
            console.log("try again later...")
        })
    }
}

//update feature
if(e.target.name=="edit"){
let userInput = prompt("enter the desired text!!!",e.target.parentElement.parentElement.querySelector('.item-text').innerHTML)
if(userInput){
    axios.post('/update-item',{text:userInput,id:e.target.getAttribute("data-id")}).then(
        ()=>{
            e.target.parentElement.parentElement.querySelector('.item-text').innerHTML=userInput
        }
    ).catch(()=>{console.log("try again later...")})
    }
    
}
})