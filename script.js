//creates a new array on load so user can choose imgs
let imgArray = new Array()

//when img is chosen, footer displays with download all button
const footer = document.createElement("div")
footer.classList.add("footer")
const downloadAll = document.createElement("button")
downloadAll.innerHTML = "Download selected images"
downloadAll.classList.add("all-imgs-button")

footer.appendChild(downloadAll)

const createImg = (data) => {
  const mainDiv = document.createElement("div")
  mainDiv.classList.add("img-container")

  const img = document.createElement("img")
  img.classList.add("img-pet")
  img.crossOrigin = "Anonymous"
  img.src = data.url

  const textDiv = document.createElement("div")
  textDiv.classList.add("text-div")

  const petTitle = document.createElement("h3")
  petTitle.innerHTML = data.title
  petTitle.classList.add("pet-title")

  const petJoined = document.createElement("p")
  const date = data.created.split(" ")
  petJoined.innerHTML = `Joined on: ${date[0]}, ${date[1]} ${date[2]}, ${date[date.length - 1]}`
  petJoined.classList.add("pet-joined")

  const petDescription = document.createElement("p")
  petDescription.innerHTML = data.description
  petDescription.classList.add("pet-description")

  const downloadButton = document.createElement('button')
  downloadButton.innerHTML = 'Select'
  downloadButton.classList.add("download-button")

  //keeps track of images chosen by user
  downloadButton.addEventListener('click', () => {
    if (imgArray.includes(data)) {
      const found = imgArray.findIndex(ele => ele === data)
      imgArray.splice(found, 1)
      img.classList.remove('selected-img')
    } else {
      imgArray.push(data)
      img.classList.add('selected-img')
    }
    
    if (imgArray.length === 0) {
      document.querySelector("#footer-page").removeChild(footer)
    } else {
      document.querySelector("#footer-page").appendChild(footer)
    }
  })

  textDiv.appendChild(petTitle)
  textDiv.appendChild(petJoined)
  textDiv.appendChild(petDescription)

  //allows button to be centered
  const buttonDiv = document.createElement("div")
  buttonDiv.classList.add('download-button-container')
  buttonDiv.appendChild(downloadButton)
  textDiv.appendChild(buttonDiv)

  //appends img and content to main div on index.html
  mainDiv.appendChild(img)
  mainDiv.appendChild(textDiv)
  document.querySelector('#container').appendChild(mainDiv)
}

//makes call for download, can only work on Chrome (webkitURL allows it so)
function download(str) {
  axios({
    url: str.url,
    method: 'GET',
    responseType: 'blob'
  })
    .then((response) => {
      const url = window.webkitURL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `${str.title.replace(/ /g, "_")}.jpeg`)
      document.body.appendChild(link)
      link.click()
  })
}

//on user click, downloads each image selected
downloadAll.addEventListener('click', () => {
  imgArray.forEach(ele => {
    download(ele)
  })
})

//renders imgs and content
const getPets = async () => {
  try {
    URL = 'https://eulerity-hackathon.appspot.com/pets'
    const response = await axios.get(URL)
    const arr = response.data
    arr.forEach((ele) => {
      createImg(ele)
    })
  } catch (error) {
    console.log(`This is your error: ${error}`)
  }
}

getPets()