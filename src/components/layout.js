import styled from "styled-components";
import { Sidebar } from "./Sidebar";

const MainStyles = styled.div`
    flex: 1;
    padding: 25px;
    height: 100%;
    overflow: auto;
`
export const Main = ({ children }) => {
    return (
        <MainStyles>
            {children}
        </MainStyles>
    )
}
export const Layout = styled.div`
    display: flex;
    height: 100vh;

`
export const Page = ({ children }) => {
    return (
        <Layout>
            <Sidebar />
            <Main>
                {children}
                <div className="content">
                    
                </div>
            </Main>
        </Layout>
    )
}