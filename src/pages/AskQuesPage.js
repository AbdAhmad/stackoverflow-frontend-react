import React, { useContext, useEffect, useState } from 'react'
import { Card, Button, Form, Container } from 'react-bootstrap'
import AuthContext from '../context/AuthContext'
import { useParams, useNavigate } from 'react-router-dom'

import '../App.css'
import '../css/askQuestionPage.css'


const AskQuesPage = () => {

    const {authTokens, setAlertType, setAlertMsg, handleVisibility} = useContext(AuthContext)

    const navigate = useNavigate()

    const {slug} = useParams();

    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [tags, setTags] = useState('')
    const [questionSlug, setQuestionSlug] = useState('')

    useEffect(() => {
        if(slug){
            getQuestion()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const getQuestion = async () => {
        const response = await fetch(`http://127.0.0.1:8000/question/${slug}`, {
            headers:{
                'Authorization': `Bearer ${authTokens?.access}`
            },
        })
        const data = await response.json();
        let questionData = data['question']
        setTitle(questionData.title)
        setBody(questionData.body)
        setTags(questionData.tags)
        setQuestionSlug(questionData.slug)
    }


    const handleSubmit = e => {
        e.preventDefault()
        if(slug){
            updateQuestion()
        }else{
            createQuestion()
        }
    }


    const createQuestion = async () => {
        const response = await fetch('http://127.0.0.1:8000/question/', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokens?.access}`
            },
            body:JSON.stringify({'title':title, 'body':body, 'tags':tags})
        })
        const data = await response.json();
        console.log(data)
        setAlertType('success')
        setAlertMsg('Question posted')
        handleVisibility()
        const questionSlug = data.slug
        navigate(`/question/${questionSlug}`)
    }


    const updateQuestion = async () => {
        const response = await fetch(`http://127.0.0.1:8000/question/${slug}/`, {
            method: 'PUT',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authTokens?.access}`
            },
            body:JSON.stringify({'title':title, 'body':body, 'tags':tags})
        })
        if(response.status === 200){
            setAlertType('success')
            setAlertMsg('Question updated')
            handleVisibility()
            navigate(`/question/${questionSlug}`)
        }
    }


    return (
        <Container>
            <h3>Ask a public question</h3>
            

            {/* Ask Question Form */}

                <Form onSubmit={handleSubmit}>
                    <Card.Body>

                        {/* Title Field */}

                        <Card.Title className='cardTitleText'>Title</Card.Title>
                        <Card.Text className='cardTitleText'>
                            Be specific and imagine you’re asking a question to another person.
                        </Card.Text>
                        <Form.Group className="mb-4">
                            <Form.Control type="text" value={title} name="title" onChange={e => setTitle(e.target.value)}  placeholder="e.g. is there an R function for finding the index of an element in a vector?" required />
                        </Form.Group>

                        {/* Body Field */}

                        <Card.Title className='cardTitleText'>Body</Card.Title>
                        <Card.Text className='cardTitleText'>
                            Include all the information someone would need to answer your question.
                        </Card.Text>
                        <Form.Group className="mb-4">
                            <Form.Control name="body" value={body} onChange={e => setBody(e.target.value)} as="textarea" rows={5} required />
                        </Form.Group>

                        {/* Tags Field */}

                        <Card.Title className='cardTitleText'>Tags</Card.Title>
                        <Card.Text className='cardTitleText'>
                            Add up to 5 tags to describe what your question is about
                        </Card.Text>
                        <Form.Group className="mb-4">
                            <Form.Control type="text" value={tags} name="tags" onChange={e => setTags(e.target.value)} placeholder="e.g.  python  javacript  django" required/>
                        </Form.Group>

                        {/* Submit Button */}

                        <div className="d-grid gap-2">
                            <Button variant="outline-primary" type='submit' size="lg">Post Your Question</Button>
                        </div>
                    </Card.Body>
                </Form>
            
        </Container>
    )
}

export default AskQuesPage