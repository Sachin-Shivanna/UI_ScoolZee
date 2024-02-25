/* eslint-disable react-hooks/rules-of-hooks */
import { formateTime } from "../../../components/commonController/commonController";

export const dateParser = (value) => {
    console.log(value)
    return new Date(value)?.toDateString()+', '+ formateTime(new Date(value))?.strTime
  }


export const discardPastDateTime = (params) => {
  const hasError = params.props.value < new Date();
  return { ...params.props, error: hasError };
} 

