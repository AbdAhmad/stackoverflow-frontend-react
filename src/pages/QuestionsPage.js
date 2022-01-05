import React, { useState, useEffect, useContext } from 'react'
import { Button, Card, Row, Col, Container } from 'react-bootstrap'
import CreatedInfo from '../components/CreatedInfo';
import {
    Link
} from "react-router-dom";
import AuthContext from '../context/AuthContext'


const QuestionsPage = () => {

    const {authTokens} = useContext(AuthContext)

    useEffect(() => {
        getQuestions()
    }, [])
 
    let [questions, setQuestions] = useState([])
    let [questionOrder, setQuestionOrder] = useState('')

    let getQuestions = async () => {
        let response = await fetch('http://127.0.0.1:8000/question/',{
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokens?.access}`
            },
        })
        let data = await response.json()
        let questions = await data['questions']
        let viewBy = await data['question_order']
        setQuestions(questions)
        setQuestionOrder(viewBy)
    }


    // useEffect(getQuestions, [])
    
    let viewQuesByLatest = async () => {
        let response = await fetch('http://127.0.0.1:8000/question?q=latest',{
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokens?.access}`
            },
        })
        let data = await response.json()
        let questions = await data['questions']
        let viewBy = await data['question_order']
        setQuestions(questions)
        setQuestionOrder(viewBy)
    }

    const myStyle = {
        display: "flex", 
        justifyContent: "space-between",
        marginTop: "4%"
    }

    const navStyle = {
        marginTop: "1%", 
        marginLeft: "42.5%"
    }

    const VAVStyle = {
        flex: "0.3"
    }

    const VAVDivStyle = {
        height: "120px", 
        display: "flex", 
        flexDirection: "row", 
        justifyContent: "center", 
        alignItems: "center",

    }

    
    return (
       
        <Container >
            <div style={myStyle}>
                <h3>Questions</h3>
                <Link to="/ask"><Button variant="primary">Ask</Button></Link>
            </div>
            <nav style={navStyle}>
                <ul className="pagination pagination-sm"> 
                    <React.Fragment>
                    <div onClick={viewQuesByLatest}>
                        <li className={`page-item ${questionOrder === 'latest'? 'active': null}`}><Link className="page-link" to="?q=latest">Latest</Link></li>
                    </div>
                    <div onClick={getQuestions}>
                        <li className={`page-item ${questionOrder !== 'latest'? 'active': null}`}><Link className="page-link" to="?q=mostviewed">Most viewed</Link></li>
                    </div>
                    </React.Fragment>
                </ul>
            </nav>
            <Card>

                {/* Questions List */}

                { questions.map(question => (
                
                    <Row style={{marginTop: "1%"}} key={question.id}>
                        <Col>
                            <div style={VAVDivStyle} className="text-center">
                                <div style={{color: question.votes > 0 ? "green": question.votes < 0 ? "red": "grey", flex: "0.3"}}>{question.votes}<br/>Votes</div>
                                <div style={{color: question.ans_count > 0 ? "green": "grey", flex: "0.3"}}>{question.ans_count}<br/>Answers</div>
                                <div style={VAVStyle}>{question.views}<br/>Views</div> 
                            </div>
                        </Col>
                        <Col md={8}>
                            <div style={{display: "flex"}}>
                                <h5><Link style={{textDecoration: "none"}} to={`/question/${question.slug}`}>{question.title}</Link></h5>
                            </div>
                            
                            {/* Question Tags */}
                            
                            { question.tags.split(/\s+/).map((tag, index) => (

                                <div style={{display: "inline-block"}} key={index}>
                                    <button style={{marginLeft: "1px"}} className="btn-block btn btn-outline-primary btn-sm">{tag}</button>
                                </div> 
                                ))
                            }
                            <div style={{float: "right", paddingRight: "2%"}}>
                                <CreatedInfo user={question.user} time={question.created_at} />
                            </div>
                        </Col>
                        <hr/>
                    </Row>
                ))}
            </Card>
        </Container>
    )
}

export default QuestionsPage