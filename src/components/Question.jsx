import React from "react";

const Question = (props) => {
    const answersData = [...props.incorrectAnswers, props.correctAnswer];
    const correctAnswer = props.correctAnswer;
    const [radioButton, setRadioButton] = React.useState("")

    function handleChange(event) {
        const {value, checked} = event.target
        setRadioButton(value)

        props.setAnswers(oldAnswers => 
            oldAnswers.map((answer, index) => 
                index === props.questionIndex 
                    ? (checked && value === correctAnswer ? 1 : 0) 
                    : answer)
        )
    }
    
    const answers = answersData.sort().map((answer, index) => {
        return   <li 
                    key={index + props.question}
                    className={`${props.gameIsOver ? (answer === correctAnswer ? 'correct' : `incorrect`) : ``}`} 
                >
                    <label htmlFor={answer + props.question}>
                        <input
                            type="radio" 
                            id={answer + props.question} 
                            name={props.question}
                            value={answer} 
                            onChange={handleChange}
                            checked={radioButton === answer}
                            disabled={props.gameIsOver}
                        />
                        {answer}
                    </label>
                </li>
    })

    return (
        <div className="Question">
            <h3 className="Question__heading">{props.question}</h3>
            <div className="Question__content">
                <ul className="Question__content-list">{answers}</ul>
            </div>
        </div>
    )
}

export default Question