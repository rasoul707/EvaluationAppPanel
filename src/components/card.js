import styled from "styled-components";

const CardHead = styled.div`
    padding-bottom: 15px;
    margin-bottom: 15px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
`
const CardMeta = styled.div`
`
const CardTitle = styled.h2`
    font-size: 1.5rem;
    margin-bottom: 0;
    color: #895BF2;
`

const CardStyle = styled.div`
    background-color: #fff;
    padding: 25px;
    box-shadow: 0 0 15px rgba(0, 0, 0, .05);
    border-radius: 12px;
`
const Card = ({ title, meta, children, ...otherProps }) => {
    return (
        <CardStyle {...otherProps}>
            {(title || meta) && <CardHead>
                <CardTitle>{title}</CardTitle>
                <CardMeta>{meta}</CardMeta>
            </CardHead>}
            {children}
        </CardStyle>
    )
}

export default Card;