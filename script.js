var images = { }


const imagePaths = ['assets/img/watermelon.png',
'assets/img/strawberry.png',
'assets/img/orange.png',
'assets/img/lime.png',
'assets/img/cherry.png',
'assets/img/banana.png',
'assets/img/apple.png',
'assets/img/papaya.png',
'assets/img/coconut.png',
'assets/img/pear.png',
'assets/img/plum.png',
'assets/img/grapes.png']

var loadedCount = 0
const musicAssetLength = 5
var loadedSoundCount = 0
var payloadComplete = 0


function increaseLoadedCount()
{


  loadedCount++
  console.log(` loaded image ${ loadedCount }`)
  if( loadedCount === imagePaths.length )
  {
    console.log(' all image assets loaded ')
    payloadComplete++
    allAssetsLoaded()

  }
}


function createImageAsset(src)
{

    var newImage = document.createElement("IMG")
    newImage.addEventListener("load",increaseLoadedCount,false)
    console.log('added event listener to image ')
    newImage.src = src
    images[src] = newImage

}


function createImages()
{
  console.log(' started loading images ')

    const numberOfImages = imagePaths.length
    var i

    for( i = 0; i < numberOfImages; i++ )
    {

      console.log(' creating image ' + i )
      createImageAsset(imagePaths[i])
    }


  console.log(' finished loading images ')

}


createImages()





var pixelImageSize = 50
var clientWidth
var clientHeight
var userIsNew // get local storage item from browser
var img
var gameAreaWidth = 400
var gameAreaHeigth = 400
var totalFruits, remainingFruits, totalTime, gameTimeOutId, remainingTime, currentRemainingTime, timeCounterId
var fruitJumpIntervalId

// Storage
var level = Number( window.localStorage.getItem('level') ) || 1
window.localStorage.setItem('level',level.toString() ) // SET level

var levelOneTime = 30000
var currentLevelTime = Number( window.localStorage.getItem('currentLevelTime')) || levelOneTime
window.localStorage.setItem('currentLevelTime',currentLevelTime.toString() )

var highestLevel = Number( window.localStorage.getItem('highestLevel') ) || 1
window.localStorage.setItem('highestLevel',highestLevel.toString() )

var i = 0
var lastPlayedLevel = level
window.localStorage.setItem('lastPlayedLevel',lastPlayedLevel)

var lastPlayedLevelTime = levelOneTime
window.localStorage.setItem('lastPlayedLevelTime',lastPlayedLevelTime)

var currentLevelTime = 20000
window.localStorage.setItem('currentLevelTime',currentLevelTime)


var gameMusic, startGameSound, squashSound, gameOverSound, levelWonSound

const fruitImagesUrl =
['assets/img/watermelon.png',
'assets/img/strawberry.png',
'assets/img/orange.png',
'assets/img/lime.png',
'assets/img/cherry.png',
'assets/img/banana.png',
'assets/img/apple.png',
'assets/img/papaya.png',
'assets/img/coconut.png',
'assets/img/pear.png',
'assets/img/plum.png',
'assets/img/grapes.png']



const numberOfFruitImages = fruitImagesUrl.length

function allAssetsLoaded()
{
    if( payloadComplete === 2 )
    {
      // display
      document.getElementById("preloader").style.display = "none"
      document.getElementById("start-screen-container").style.display = "flex"
      document.getElementById("start-screen-play-button").style.display = "block"
    }
}

function musicLoaded()
{
  loadedSoundCount++
  console.log(` loaded sound ${ loadedSoundCount }`)
  if( loadedSoundCount === musicAssetLength )
  {
    payloadComplete++
    allAssetsLoaded()
  }

}

const loadSounds = function()
                  {
                     gameMusic = new Audio("assets/music/game_music.mp3")
                     gameMusic.addEventListener("canplay",musicLoaded,false)
                     gameMusic.loop = true

                     startGameSound = new Audio("assets/music/start_game_sound.mp3")
                     startGameSound.addEventListener("canplay",musicLoaded,false)

                     squashSound = new Audio("assets/music/squash_sound.mp3")
                     squashSound.addEventListener("canplay",musicLoaded,false)

                     gameOverSound  = new Audio("assets/music/game_over_sound.mp3")
                     gameOverSound.addEventListener("canplay",musicLoaded,false)

                     levelWonSound = new Audio("assets/music/level_won_sound.mp3")
                     levelWonSound.addEventListener("canplay",musicLoaded,false)

                  }

loadSounds()

const launchGame = function()
                  {
                      gameMusic.play()
                      document.getElementById("start-screen-container").style.display = "none"
                      document.getElementById("home-container").style.display = "flex"
                      document.getElementById("home").style.display = "block"
                  }

const startNewGame = function()
                {
                    gameMusic.play()
                    setup(true)
                }


const goToNextLevel = function()
                    {
                      // go to next level
                      ++level
                      window.localStorage.setItem('level',level.toString() )

                      currentLevelTime -= 1000
                      window.localStorage.setItem('currentLevelTime',currentLevelTime.toString() )


                      lastPlayedLevel = level - 1
                      window.localStorage.setItem('lastPlayedLevel',lastPlayedLevel.toString() )

                      if( level >= highestLevel )
                      {
                        highestLevel = level
                        window.localStorage.setItem('highestLevel',highestLevel.toString() )

                      }

                      lastPlayedLevelTime = currentLevelTime + 1000
                      window.localStorage.setItem('lastPlayedLevelTime',lastPlayedLevelTime.toString() )

                      gameMusic.play()
                      document.getElementById("level-won-container").style.display = "none"
                      cleanOldGameArea()
                      setup()
                    }


const retry = function()
                    {

                      cleanOldGameArea()
                      gameMusic.play()

                      // replay current level
                      document.getElementById("game-over-container").style.display = "none"
                      document.getElementById("level-won-container").style.display = "none"
                      document.getElementById("pause-menu-container").style.display = "none"
                      document.getElementById("game-world-container").style.display = "flex"
                      document.getElementById("game-world").style.display = "block"

                      setup()
                    }

const continueGame = function()
                {
                    setup(false)
                }

const pauseGame = function()
                {


                          // pause games

                          clearInterval(timeCounterId)
                          clearTimeout(gameTimeOutId)
                          clearInterval(fruitJumpIntervalId)

                          timeCounterId = undefined
                          gameTimeOutId = undefined
                          fruitJumpIntervalId = undefined


                          console.log(timeCounterId)
                          console.log(gameTimeOutId)
                          console.log(fruitJumpIntervalId)


                          console.log( remainingTime)
                          console.log( remainingFruits )
                          document.getElementById("game-world-container").style.display = 'none'
                          document.getElementById("pause-menu-container").style.display = 'flex'
                          document.getElementById("pause-menu").style.display = 'block'
                }

const continuePlay = function()
                {
                  // continue game
                  console.log(remainingTime)

                  console.log('after')
                  // continue from where stopped
                gameTimeOutId = window.setTimeout(function(){ gameOver },remainingTime)

                 timeCounterId =  window.setInterval(timeCounter,1000)

                 fruitJumpIntervalId = setInterval(fruitJump,1000)


                 console.log(gameTimeOutId)
                 console.log(timeCounterId)
                 console.log(fruitJumpIntervalId)

                  document.getElementById("pause-menu-container").style.display = 'none'
                  document.getElementById("game-world-container").style.display = 'flex'
                  document.getElementById("game-world").style.display = 'block'


                }

const displayHome = function()
                {

                  clearInterval(timeCounterId)
                  clearTimeout(gameTimeOutId)
                  clearInterval(fruitJumpIntervalId)
                  currentLevelTime = levelOneTime
                  cleanOldGameArea()
                  // end and save game state
                  console.log("working")


                  document.getElementById("level-won-container").style.display = 'none'
                  document.getElementById("level-won-menu").style.display = 'none'
                  document.getElementById("game-over-container").style.display = 'none'
                  document.getElementById("game-over-menu").style.display = 'none'

                  document.getElementById("game-world-container").style.display = 'none'
                  document.getElementById("pause-menu-container").style.display = 'none'
                  document.getElementById("home-container").style.display = 'flex'
                  document.getElementById("home").style.display = 'block'

                  document.getElementById("highest-level-number").innerText = window.localStorage.getItem("highestLevel")
                  gameMusic.play()
                }


const cleanOldGameArea = function()
                    {
                      // remove image child
                      const fruitImg = document.getElementById("fruitImage")

                      if( !fruitImg )
                      {
                        return
                      }

                      fruitImg.parentNode.removeChild( fruitImg )
                    }

const fruitJump = function()
              {
                  clearInterval(fruitJumpIntervalId)
                  redrawFruitWithoutChange()
              }

const timeCounter = function()
            {
                  --remainingTime
                  console.log(remainingTime)
                  currentRemainingTime = remainingTime

                  document.getElementById('remaining-time').innerText = currentRemainingTime + 's'

                  if( remainingTime === 0 )
                  {
                    console.log('time counter called gameover ')
                    gameOver()
                  }
            }

const createRandomLocation = async function()
          {

            var x = Math.floor(  Math.random() * clientWidth)
            var y = Math.floor( Math.random() * clientHeight )

            console.log(' x : ' + x  + ' clientWidth ' + clientWidth )
            if( ( x ) > ( clientWidth - 50 ) )
            {
              console.log('exceeded width ' + x )
              x = clientWidth - imageSize
              console.log('new width ' + x )
            }

            if( ( y ) > ( clientHeight - 50 ) )
            {
              console.log('exceeded height ' + y )
              y = clientHeight - pixelImageSize
              console.log('new height ' + y )
            }


            console.log( x + ' x pos ')
            console.log( y + ' y pos ')

              return {
                x: x ,
                y: y
              }
          }

const setRandomLocation = async function()
          {
            const cords = await createRandomLocation()
            console.log(cords)
            img.style.left = cords.x + "px"
            img.style.top = cords.y + "px"
            console.log(cords.x+ '  ' + cords.y + ' time ' + i++)

          }


function getRandomFruit()
{
  let randomFruitIndex = Math.floor( Math.random() * numberOfFruitImages )
  return imagePaths[randomFruitIndex]
}

const redrawFruit = function()
          {
            setRandomLocation()
            img.src = getRandomFruit()
            fruitJumpIntervalId = setInterval(fruitJump,1000)
          }

          const redrawFruitWithoutChange = function()
                    {
                      setRandomLocation()
                      fruitJumpIntervalId = setInterval(fruitJump,1000)
                    }

const endGame = function()
              {
                // You won

                levelWonSound.play()
                gameMusic.pause()

                document.getElementById("game-world-container").style.display = 'none'
                document.getElementById("pause-menu-container").style.display = 'none'
                document.getElementById("level-won-container").style.display = "flex"
                document.getElementById("level-won-menu").style.display = "block"

                console.log(' You click all the fruits ! ')
                console.log(' time remaining ' + remainingTime + 's' )
                // clear time counter
                clearInterval(timeCounterId)
                clearTimeout(gameTimeOutId)
                clearInterval(fruitJumpIntervalId)
                // end game
                img.removeEventListener('click',imageClickHandler,false)


              }

const gameOver = function()
              {

                gameOverSound.play()
                gameMusic.pause()

                img.removeEventListener('click',imageClickHandler,false)
                console.log('gameover')
                console.log(' total fruits squashed ' + ( totalFruits - remainingFruits ) )
                clearTimeout(gameTimeOutId)
                clearInterval(timeCounterId)
                clearInterval(fruitJumpIntervalId)
                cleanOldGameArea()

                document.getElementById("game-world-container").style.display = 'none'
                document.getElementById("pause-menu-container").style.display = 'none'
                document.getElementById("game-over-container").style.display = 'flex'
                document.getElementById("game-over-menu").style.display = 'block'


                if( level > highestLevel )
                {
                  highestLevel = level
                }

              }

const imageClickHandler = function()
        {
          squashSound.play()

          --remainingFruits
          document.getElementById("remainingFruits").innerText = remainingFruits
          clearInterval(fruitJumpIntervalId)
          // check if remainingFruits is zero
          if( remainingFruits === 0 )
          {
            endGame()
          }
          else
          {
            // draw new fruit in new location
          redrawFruit()
          }
        }

const setup = function(isNewGame)
        {


          document.getElementById("home-container").style.display = 'none'
          document.getElementById("game-world-container").style.display = 'flex'
          document.getElementById("game-world").style.display = 'block'


          if( isNewGame )
          {
            // set current level 0
            level = 1
            window.localStorage.setItem("level", level.toString() )
            currentLevelTime = 30000
            window.localStorage.setItem("currentLevelTime", currentLevelTime.toString() )

          }
          else
          {

          }


          /** Remaining Fruits **/
          totalFruits = 10
          remainingFruits = totalFruits

          levelTime = Number( window.localStorage.getItem("currentLevelTime") )
          remainingTime = Math.floor( levelTime / 1000 )

          document.getElementById("remaining-time").innerText = remainingTime + 's'
          document.getElementById("level").innerText = level //




          // Client Width Settings

                    clientWidth = document.getElementById("game-body").clientWidth
                    clientHeight = document.getElementById("game-body").clientHeight
                    imageSize = 50

          /** Image */
          img = new Image()
          img.id = "fruitImage"
          img.style.position = 'absolute'
          setRandomLocation()
          img.src = getRandomFruit()
          img.style.width = imageSize +'px'
          img.style.height = imageSize + 'px'
          img.style.padding = '0px'
          img.style.margin = '0px'
          img.addEventListener('click',imageClickHandler,false)
          document.querySelector('#game-body').appendChild(img)

          document.getElementById("remainingFruits").innerText = remainingFruits
          console.log(' initial location : top ' + img.style.top + ' + ' + ' left  : ' + img.style.left )

        gameTimeOutId = setTimeout(function(){
          gameOver()
        },
        levelTime)



      timeCounterId =   setInterval(timeCounter,1000)

      }




// music and sound toggle to play bar
// smooth animations for displaying messages
// allow tabs to drop down and images to scale after drop




    // UI ELEMENTS
    const pauseButton = document.getElementById("pause-button")
    const homeButton = document.getElementById("home-button")
    const homeButton_pauseMenu = document.getElementById("home-button-pause-menu")
    const playButton = document.getElementById("play-button")
    const newGameButton = document.getElementById("new-game-button")
    const continueGameButton = document.getElementById("continue-game-button")
    const gameOverReplayButton = document.getElementById('game-over-page-replay-button')
    const pauseScreenReplayButton = document.getElementById('replay-button')
    const gameOverHomeButton = document.getElementById('game-over-page-home-button')
    const startScreenPlayButton = document.getElementById("start-screen-play-button")
    const levelWonPageNextButton = document.getElementById("level-won-page-next-button")
    const levelWonPageReplayButton = document.getElementById("level-won-page-replay-button")
    const levelWonPageHomeButton = document.getElementById("level-won-page-home-button")


    pauseScreenReplayButton.addEventListener("click",retry,false)
    newGameButton.addEventListener("click",startNewGame,false)
    continueGameButton.addEventListener("click",continueGame,false)
    homeButton.addEventListener("click",displayHome,false)
    homeButton_pauseMenu.addEventListener("click",displayHome,false)
    pauseButton.addEventListener("click",pauseGame,false)
    playButton.addEventListener("click",continuePlay,false)
    gameOverReplayButton.addEventListener("click",retry,false)
    gameOverHomeButton.addEventListener("click",displayHome,false)
    startScreenPlayButton.addEventListener("click",launchGame,false)
    levelWonPageNextButton.addEventListener("click",goToNextLevel,false)
    levelWonPageReplayButton.addEventListener("click",retry,false)
    levelWonPageHomeButton.addEventListener("click",displayHome,false)
