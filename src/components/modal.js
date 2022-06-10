import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

const Overlay = styled.div`
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, .6);
    backdrop-filter: blur(2px);
    display: ${({active}) => active ? 'block' : 'none'};
`

const ModalClose = styled.div`
    position: absolute;
    color: #fff;
    right: 10px;
    bottom: calc(100% + 5px);
    cursor: pointer;
`

const ModalStyle = styled.div`
    position: fixed;
    min-width: 600px;
    background-color: #fff;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 35px;
    border-radius: 15px;
    display: ${({active}) => active ? 'block' : 'none'};
`
const Modal = ({active, children, onClose, ...otherProps}) => {
    return (
        <>
            <Overlay active={active} onClick={onClose} />
            <ModalStyle active={active} {...otherProps}>
                <ModalClose onClick={onClose}>
                    <FontAwesomeIcon icon="times" />
                </ModalClose>
                {children}
            </ModalStyle>
        </>
    )
}

export default Modal;