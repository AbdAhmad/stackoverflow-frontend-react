import React, { useContext, useEffect, useState} from 'react'
import { Card, Button, Container, Row, Col } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const ProfilePage = () => {

    const {user, authTokens} = useContext(AuthContext)
    const [hasPermission, setHasPermission] = useState(false)

    let {username} = useParams()

    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [location, setLocation] = useState('')
    const [bio, setBio] = useState('')
    const [questions, setQuestions] = useState([])
    const [answers, setAnswers] = useState([])

    const profileInfoStyle = {
        fontSize: "20px", 
        fontStyle: "italic"
    }

    const getProfile = async () => {
        const response = await fetch(`http://127.0.0.1:8000/profile/${username}`, {
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokens?.access}`
            },
        })

        const data = await response.json();
        setFullName(data['profile'].full_name)
        setEmail(data['profile'].email)
        setLocation(data['profile'].location)
        setBio(data['profile'].bio)
        setQuestions(data['questions'])
        setAnswers(data['answers'])
    }

    let permission = () => {
        if(username === user['username']){
            setHasPermission(true)
        }
    }


    let deleteQues = questionSlug => {
        fetch(`http://127.0.0.1:8000/question/${questionSlug}`, {
            method: 'DELETE',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokens?.access}`
            },
        })
    }


    let deleteAns = answerId => {
        fetch(`http://127.0.0.1:8000/answer/${answerId}`, {
            method: 'DELETE',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokens?.access}`
            },
        })
    }



    useEffect(() => {
        getProfile()
        permission()
    }, [])

    return (
        <>
            <Card style={{width: "90%", marginLeft: "5%"}}>
            <Card.Body>
                <Card.Title><h3><i>{fullName ? fullName: "This user has no Full Name"}</i></h3></Card.Title>
                <br/>
                <Card.Text >
                <p style={{display: "flex"}} className="card-text"><i style={profileInfoStyle} className="fa fa-envelope profile_info"> {email ? email : "Email not available"}</i></p>
                <p style={{display: "flex"}} className="card-text"><i style={profileInfoStyle} className="fa fa-map-marker profile_info"> {location ? location : "Location not available"}</i></p>
                <p style={{display: "flex"}} className="card-text"><i style={profileInfoStyle} className="fa fa-info-circle profile_info"> {bio ? bio: "Bio not available"}</i></p>
                </Card.Text>
                <br/>
                
                {
                    hasPermission ?
                        <Link style={{textDecoration: "none"}} to='/edit_profile'>
                        <div className="d-grid gap-2">
                        <Button variant="outline-secondary" size="lg">
                            <i>Update Your Profile</i>
                        </Button>
                        </div>
                        </Link>
                        : 
                        null
                }

            </Card.Body>
            <br/>
            <Container>
                <Row>
                    <Col>
                    <h5>{questions.length} {questions.length > 1 ? 'Questions' : 'Question'}</h5>
                    {questions.map((question) => (
                        <React.Fragment>
                        <Link style={{textDecoration: "none"}} to={`/question/${question.slug}/`}>{question.title}</Link>
                        {
                            hasPermission ? 
                            <React.Fragment>
                            <Link to={`/update_question/${question.slug}/`}><Button variant='outline-success btn-sm'>Edit</Button></Link>
                            <div onClick={() => deleteQues(question.slug)}><Button variant='outline-danger btn-sm'>Delete</Button></div>
                            </React.Fragment>
                            :
                            null 
                        }

                        </React.Fragment>
                    ))}
                    </Col>
                    
                    <Col>
                  
                    <h5>{answers.length} {answers.length > 1 ? 'Answers' : 'Answer'}</h5>

                    {answers.map((answer) => (
                        <React.Fragment>
                            <Link style={{textDecoration: "none"}} to={`/answer/${answer.question_to_ans}/`}>{answer.answer}</Link>
                            {
                                hasPermission ? 
                                <React.Fragment>
                                <Link to=""><Button variant='outline-success btn-sm'>Edit</Button></Link>
                                <div onClick={() => deleteAns(answer.id)}><Button variant='outline-danger btn-sm'>Delete</Button></div>
                                <br/>
                                </React.Fragment>
                                :
                                null 
                            }
                        </React.Fragment>  
                    ))}

                    </Col>
                </Row>
            </Container>
            </Card>
        </>
    )
}

export default ProfilePage