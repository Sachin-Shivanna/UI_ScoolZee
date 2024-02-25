import React,{useEffect} from 'react'

const AssessmentResult = (params) => {

    useEffect(() => {
        console.log(params.examData)
    },[])

  return (
    <div>AssessmentResult</div>
  )
}

export default AssessmentResult