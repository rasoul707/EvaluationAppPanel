import { useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import { Page } from "../../components/layout";
import Evaluation from "./evaluateMetric/evaluate";
import EvaluateMetric from "./evaluateMetric/evaluate";
import Metric from "./metric/list";
import NewMyComment from "./myComment/new";
import MyMetric from "./myMetric/list";
import NewMyMetric from "./myMetric/new";
import MyComment from "./myComment/list";
import MyQuestionnaire from "./myQuestionnaire/list";
import NewMyQuestionnaire from "./myQuestionnaire/new";
import Questionnaire from "./questionnaire/list";
import NewQuestionnaire from "./questionnaire/new";
import Software from "./software/list";
import NewSoftware from "./software/new";
import Users from "./users/list";
import NewUser from "./users/new";
import Comment from "./comment/list";
import NewComment from "./comment/new";
import NewMyCompare from "./myCompare/new";
import MyCompare from "./myCompare/list";
import HomeScreen from "./HomeScreen";
import EvaluationComment from "./evaluateComment/evaluateC";
import EvaluationQuestion from "./evaluateQuestion/evaluateQ";
import EvaluationR from "./evaluateR/rating";
import Rate from "./rating/list";
import NewMyRating from "./myRating/new";
import MyRating from "./myRating/list";
import Compare from "./compare/list";
import CompareEva from "./evaluateCompare/evaluateCompare";
import ResultQuestion from "./resultQ/resultQ";
import ResultCompare from "./resultCompare/resultCompare";
import ResultMetric from "./resultM/resultM";
import ResultComment from "./resultComment/resultComment";
import ResultRating from "./resultRating/resultRating";
import Exportexcel from "./ResultExcellMetric/ResultExcellMetric";
import MyPakage from "./myPakage/list";
import NewMyPakage from "./myPakage/new";


const Dashboard = () => {


    // const token = useSelector(state => state.auth.token);

    // if (!token) {
    //     return <Redirect to="/auth/signin/" />
    // }

    return (
        <div>
            hhh
            <Page>
                <Switch>
                    <Route path="/" exact component={HomeScreen} />
                    <Route path="/dash/software/" exact component={Software} />
                    <Route path="/dash/software/new/" exact component={NewSoftware} />
                    <Route path="/dash/software/:id/edit/" exact component={NewSoftware} />
                    {/* <Route path="/" exact component={App} /> */}

                    <Route path="/users/" exact component={Users} />
                    <Route path="/users/new/" exact component={NewUser} />
                    <Route path="/users/:id/edit/" exact component={NewUser} />

                    <Route path="/metric/" exact component={Metric} />

                    <Route path="/questionnaire/" exact component={Questionnaire} />
                    <Route path="/questionnaire/new/" exact component={NewQuestionnaire} />
                    <Route path="/questionnaire/:id/edit/" exact component={NewQuestionnaire} />

                    <Route path="/myMetric/" exact component={MyMetric} />
                    <Route path="/myMetric/new/" exact component={NewMyMetric} />
                    <Route path="/myMetric/:id/edit/" exact component={NewMyMetric} />

                    <Route path="/myQuestionnaire/" exact component={MyQuestionnaire} />
                    <Route path="/myQuestionnaire/new/" exact component={NewMyQuestionnaire} />
                    <Route path="/myQuestionnaire/:id/edit/" exact component={NewMyQuestionnaire} />

                    <Route path="/myComment/" exact component={MyComment} />
                    <Route path="/myComment/new/" exact component={NewMyComment} />
                    <Route path="/myComment/:id/edit/" exact component={NewMyComment} />

                    <Route path="/comment/" exact component={Comment} />
                    <Route path="/comment/new/" exact component={NewComment} />
                    <Route path="/comment/:id/edit/" exact component={NewComment} />

                    <Route path="/myRating/" exact component={MyRating} />
                    <Route path="/myRating/new/" exact component={NewMyRating} />
                    <Route path="/myRating/:id/edit/" exact component={NewMyRating} />

                    <Route path="/rating/" exact component={Rate} />

                    <Route path="/mycompare/" exact component={MyCompare} />
                    <Route path="/mycompare/new/" exact component={NewMyCompare} />
                    <Route path="/mycompare/:id/edit/" exact component={NewMyCompare} />
                    <Route path="/compare/" exact component={Compare} />

                    <Route path="/evaluateMetric/:id/" exact component={Evaluation} />
                    <Route path="/evaluateComment/:id/" exact component={EvaluationComment} />
                    <Route path="/evaluateQuestion/:id/" exact component={EvaluationQuestion} />
                    <Route path="/evaluateR/:id/" exact component={EvaluationR} />
                    <Route path="/evaluateCompare/:id/" exact component={CompareEva} />

                    <Route path="/resultQ/:softwareid/:categoryid" exact component={ResultQuestion} />
                    <Route path="/resultCompare/:id" exact component={ResultCompare} />
                    <Route path="/resultMetric/:id" exact component={ResultMetric} />
                    <Route path="/resultComment/:id" exact component={ResultComment} />
                    <Route path="/resultRating/:id" exact component={ResultRating} />
                    <Route path="/ResultExcellMetric" exact component={Exportexcel} />
                    <Route path="/myPakage/" exact component={MyPakage} />
                    <Route path="/myPakage/new/" exact component={NewMyPakage} />


                </Switch>
            </Page>
        </div>
    )
}
export default Dashboard;