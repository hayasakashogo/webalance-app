import React from 'react'

type SpinnerProps = {
    size: string
}

const Spinner = (props: SpinnerProps) => {
    const { size } = props;
    return (
        <span style={{ height: size, width: size }} className="border-2 border-t-transparent border-base rounded-full animate-spin"></span>
    )
}

export default Spinner
