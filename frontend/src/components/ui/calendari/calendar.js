import {DatePicker} from '@gsebdev/react-simple-datepicker';
import "./page.css";

function Example() {
    const onChangeCallback = ({target}) => {
        // a callback function when user select a date
    }
    return (
        <DatePicker
            id='datepicker-id'
            name='date-demo'
            onChange={onchangeCallback}
            value={'01/02/2023'}
        /> 
    )
}

export default DatePicker ;
