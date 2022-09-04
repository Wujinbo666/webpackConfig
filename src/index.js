import helloWorld from './hello-world'
import imgsrc from './assets/form_icon.png'
import Logosvg from './assets/logo.svg'
import exampleTxt from './assets/example.txt'
import pngMap from './assets/img-1.jpg'
import './style.css'
import './style.less'
import Data from './assets/data.xml'
import Notes from './assets/data.csv'
import toml from './assets/data.toml'
import yaml from './assets/data.yaml'
import json5 from './assets/data.json5'


helloWorld()

const img = document.createElement('img')
img.src = imgsrc
img.style.width = `${300}px`
document.body.appendChild(img)

const img2 = document.createElement('img')
img2.style.cssText = `width: 600px; height: 200px`
img2.src = Logosvg
document.body.appendChild(img2)

const block = document.createElement('div')
block.style.cssText = 'width: 200px;height: 200px; background:aliceblue '
block.classList.add('block-bg')
block.textContent = exampleTxt
document.body.appendChild(block)

const img3 = document.createElement('img')
img3.style.cssText = 'width: 600px; height: 240px; display:block;'
img3.src = pngMap
document.body.appendChild(img3)

document.body.classList.add('hello')

const span = document.createElement('span')
span.classList.add('icon')
span.innerHTML = '&#xe654;'
document.body.appendChild(span)

console.log(Data)
console.log(Notes)

console.log(toml);
console.log(yaml);
console.log(json5);
