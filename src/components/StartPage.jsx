import React from "react";

const StartPage = (props)  => {

    const [categoriesData, setCategoriesData] = React.useState([])
    const difficultiesData = ['easy', 'medium', 'hard']
    
    React.useEffect(() => {
        fetch(`https://opentdb.com/api_category.php`)
        .then((response) => response.json())
        .then((data) => {
            setCategoriesData(() => {
                const rawData = data.trivia_categories
                return rawData.map(obj => {
                    return {
                        ...obj,
                        name: decode(obj.name)
                    }
                })
            })
        });
    }, [])

    const categories = categoriesData.map(category => {
        return <option 
                    key={category.id}
                    value={category.id}
                >
                    {category.name}
                </option>
    })

    const difficulties = difficultiesData.map(difficulty => {
        return <option 
                    key={difficulty}
                    value={difficulty}
                >
                    {capitalizeFirst(difficulty)}
                </option>
    })

    function getSelectedCategory(e) {
        props.setOptions(prevObj => ({
            ...prevObj,
            categoryID : e.target.value
        }))
    }

    function getSelectedDifficulty(e) {
        props.setOptions(prevObj => ({
            ...prevObj,
            difficulty : e.target.value
        }))
    }

    function capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      };

    function decode(str) {
        let txt = new DOMParser().parseFromString(str, "text/html");
        return txt.documentElement.textContent;
    }
    
    return (
        <div className={`StartPage screen ${props.startQuiz ? 'hide' : ''}`}>
            {categoriesData.length > 0 
                ?
                <>
                    <h1 className="StartPage__heading">Quizzical</h1>
                    <p className="StartPage__description">Press "Start Quiz" to challenge yourself in general questions</p>
                    <div className="StartPage__selections">
                        <div className="StartPage__selections-select">
                            <select onChange={getSelectedCategory}>
                                {categories}
                            </select>
                        </div>
                        <div className="StartPage__selections-select">
                            <select onChange={getSelectedDifficulty}>
                                {difficulties}
                            </select>
                        </div>
                    </div>
                    <div className="StartPage__button">
                        <button onClick={props.onStartClick}>Start Quiz</button>
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

export default StartPage;