import * as React from 'react'
import axios from 'axios'

const reducer = (state, action) => {
    switch (action.type) {
        case 'update_temp':
            return { ...state, temp: { ...action.payload } }
        case 'update_saved':
            return { ...state, saved: [...action.payload] }
        default:
            return state
    }
}

const Fib = () => {
    const [state, dispatch] = React.useReducer(reducer, {
        // number: '',
        error: '',
        temp: {},
        saved: []
    })

    React.useEffect(() => {
        const getTemp = async () => {
            try {
                const response = await axios.get('/api/temp')
                // console.log(response.data)
                dispatch({ type: 'update_temp', payload: { ...response.data.data } })
            } catch (error) {
                console.log(error)
            }
        }
        const getSaved = async () => {
            try {
                const response = await axios.get('/api/saved')
                // console.log(response.data)
                dispatch({ type: 'update_saved', payload: [...response.data.data] })
            } catch (error) {
                console.log(error)
            }
        }


        const form = document.querySelector('form')
        const input = form.querySelector('input')
        form.addEventListener('submit', async (e) => {
            e.preventDefault()
            // console.log('submit')
            // console.log(input.value)
            try {
                await axios.post('/api/fib', {
                    number: input.value
                })
                getTemp()
                getSaved()
            } catch (error) {
                console.log(error)
            }
        })
        getTemp()
        getSaved()


    }, [])

    return (
        <div>
            <form>
                <input type='text' />
                <input type='submit' />
            </form>
            <p>Numbers: {state.saved.map(({ number }) => number + ',')}</p>
            <p>Results</p>
            {Object.keys(state.temp).map((number) => <p key={number.toString()}>Number: {number}, Result: {state.temp[number]}</p>)}
        </div>
    )
}


export default Fib