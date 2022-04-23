import Card from "./components/Card"
import { useState, useEffect} from "react"
import { nanoid } from "nanoid"
import Confetti from 'react-confetti'

export default function App() {
  // getting the size of the screen (innerWidth, innerHeight) for Confetti canvas
  const [windowSize, setWindowSize] = useState({
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
  })
  function detectSize() {
    setWindowSize({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    })
  }
  useEffect(() => {
    window.addEventListener('resize', detectSize)
    return () => {
      window.removeEventListener('resize', detectSize)
    }
  }, [windowSize])

  // turning darkmode false or true, and saving it on local storage
  const [darkMode, setDarkMode] = useState(
    () => JSON.parse(localStorage.getItem("darkmode")) || false
  )
  const isDark = darkMode ? "dark" : ""

  function toggleDarkMode() {
    setDarkMode(prevMode => !prevMode)
  }

  useEffect(() => {
    localStorage.setItem("darkmode", JSON.stringify(darkMode))
  }, [darkMode])

  function refreshGame() {
    setCards(allNewCards())
    setStep(0)
  }
  const [step, setStep] = useState(0)

  const [numberOfNumbers, setNumberOfNumbers] = useState(6)

  const [cards, setCards] = useState(allNewCards())
  const [tenzies, setTenzies] = useState(false)
  
  useEffect(() => {
    // if all cards were held;
    const allHeld = cards.every(card => card.isHeld)

    const firstValue = cards[0].value
    // and if the value of cards were equal, set the 'tenzies' state to true, which it means the player has won!
    const allSameValue = cards.every(card => card.value === firstValue)

    if(allHeld && allSameValue) {
      setTenzies(true)
    }
  }, [cards])

  function generateNewCard() {
    return {
        value: Math.ceil(Math.random() * numberOfNumbers),
        isHeld: false,
        // 'nanoid' returns random unique ID
        id: nanoid()
    }
  }
  // returning 10 random number between 1 to 6
  function allNewCards() {
    const newCards = []
    for (let i = 0; i < 10; i++) {
      newCards.push(generateNewCard())
    }
    return newCards
  }
  // if the player haven't won yet, roll new cards
  function rollCards() {
    if(!tenzies) {
      setCards(prevCards => prevCards.map(card => {
        return card.isHeld ? card : generateNewCard()
      }))
      setStep(prevStep => prevStep + 1)
    }
    // if the player won, set the 'tenzies' state to false, which the player can play again and again ...
    else {
      setTenzies(false)
      refreshGame()
    }
  }
  // if each card was held, hold it, and don't roll it
  function holdCards(id) {
    setCards(prevCards => prevCards.map(card => {
      return card.id === id ? {...card, isHeld: !card.isHeld} : card
    }))
  }
  const cardElements = cards.map(card => (
    <Card 
      key={card.id}
      value={card.value}
      isHeld={card.isHeld}
      holdCards={() => holdCards(card.id)}
      darkMode={darkMode}
    />
  ))
  function mediumMode() {
    if(tenzies) {
      setTenzies(false)
    }
    setNumberOfNumbers(10)
    refreshGame()
  }
  function hardMode() {
    if(tenzies) {
      setTenzies(false)
    }
    setNumberOfNumbers(15)
    refreshGame()
  }
  let selectedMode;
  if(numberOfNumbers === 6) {
    selectedMode = "Esay"
  } else if(numberOfNumbers === 10) {
    selectedMode = "Medium"
  } else if(numberOfNumbers === 15) {
    selectedMode = "Hard"
  }
  return (
    <main>
      <div className={`tenziesApp ${isDark}`}>
        {tenzies && <Confetti style={{position: "fixed"}} width={windowSize.windowWidth} height={windowSize.windowHeight} />}
        <div className="toggler">
          <p className="toggler--light">Light</p>
          <div className="toggler--slider" onClick={toggleDarkMode} >
            <div className="toggler--slider--circle"></div>
          </div>
          <p className="toggler--dark">Dark</p>
        </div>
        <h1 className={`title ${isDark}`}>Tenzies</h1>
        <p className={`instructions ${isDark}`}>Roll until all cards are the same. Click each card to freeze it at its current value between rolls.</p>
        <div className="cardsContainer">
          {cardElements}
        </div>
        <button className="rollCards" onClick={rollCards}>
          {tenzies ? "New Game" : "Roll"}
        </button>
        <h2 className={`winningText ${isDark}`}>{tenzies ? "you won with " + step + " steps!" : "steps : " + step}</h2>
        <div className="modeSelections">
          <button className="rollCards" onClick={mediumMode}>
            Medium
          </button>
          <button className="rollCards" onClick={hardMode}>
            Hard
          </button>
        </div>
        <h2 className={`winningText ${isDark}`}>{"level selected : " + selectedMode}</h2>
      </div>
    </main>
  )
}