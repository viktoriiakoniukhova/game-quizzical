import React from 'react';
import Question from './Question'
import turnBack from '../img/back-arrow.png'

const Main = (props) => {
    const NUMBER_OF_QUESTIONS = 5
    const categoryID = props.options.categoryID
    const difficulty = props.options.difficulty
    const url = `https://opentdb.com/api.php?amount=${NUMBER_OF_QUESTIONS}&category=${categoryID}&difficulty=${difficulty}`

    const [questionsData, setQuestionsData] = React.useState([]);
    const [answers, setAnswers] = React.useState(Array.apply(null, Array(5)).map(() => 0))
    const [points, setPoints] = React.useState(0);

    const [gameIsOver, setGameIsOver] = React.useState(false);
    const [replay, setReplay] = React.useState(false);

    React.useEffect(() => {
        if(props.startQuiz){
            fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    setQuestionsData(() => {
                        const rawData = data.results
                        return rawData.map(obj => {
                            const question = decode(obj.question)
                            const correctAnswer = decode(obj.correct_answer)
                            const incorrectAnswers = obj.incorrect_answers.map(ans => decode(ans))
                            return {
                                ...obj,
                                question: question,
                                correct_answer: correctAnswer,
                                incorrect_answers: incorrectAnswers
                            }
                        })
                    })
                });
        }
    }, [props.startQuiz, replay, url])

    React.useEffect(() => {
        setPoints(answers.reduce((prev, curr) => prev + curr), 0)
    }, [answers])

    const questions = questionsData.map((questionData, index) => 
        <Question 
            key={index}
            questionIndex = {index}
            question={questionData.question}
            correctAnswer={questionData.correct_answer}
            incorrectAnswers={questionData.incorrect_answers}
            setAnswers={setAnswers}

            gameIsOver = {gameIsOver}
        />)

    function handleButtonClick(type) {
        if (type==="result") {
            setGameIsOver(true)
        }

        if (type==="return") {
            clearData()

            props.onBackClick()
            setGameIsOver(false)
        }

        if (type==="reset") {
            clearData()

            setReplay(prevState => !prevState)
            setGameIsOver(false)
        }
    }
    
    function clearData() {
        setQuestionsData([])
        setAnswers(Array.apply(null, Array(5)).map(() => 0))
        setPoints(0)
    }

    function decode(str) {
        let txt = new DOMParser().parseFromString(str, "text/html");
        return txt.documentElement.textContent;
    }

    return (
        <div className={`Main screen ${props.startQuiz ? '' : 'hide'}`}>
            <div className="Main__button">
                <button 
                    className='Main__btn-return' 
                    onClick={() => {handleButtonClick('return')}}
                >
                    <img src={turnBack} alt="return" />
                </button>
            </div>

            {questionsData.length > 0 
                ?
                <>
                    <div className='Main__questions'>{questions}</div>
                    <div className="Main__results">
                    {
                        gameIsOver
                            ? 
                            <>
                                <p>You scrored {points}/5 correct answers</p>
                                <button onClick={() => {handleButtonClick('reset')}}>Play Again</button>
                            </>
                            :
                            <>
                                <button onClick={() => {handleButtonClick('result')}}>Check results</button>
                            </>
                    }
                    </div>
                </>
                :
                <div className="Main__loader">
                    <div className="loader"></div>
                </div>
            }
        </div>
    )
}

export default Main;