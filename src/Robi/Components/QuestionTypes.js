import { Container } from './Container.js'
import { QuestionType } from './QuestionType.js'

// @START-File
/**
 * 
 * @param {*} param 
 */
export async function QuestionTypes(param) {
    const { parent } = param;

    // View Container
    const container = Container({
        display: 'block',
        width: '100%',
        margin: '30px 0px 0px 0px',
        parent
    });

    container.add();

    const questionTypes = [
        {
            title: 'General',
            path: 'General'
        }
    ];

    const questions = [];

    questionTypes.forEach(type => {
        const {
            title, path
        } = type;

        const questionType = QuestionType({
            title,
            path,
            questions: questions.filter(item => item.QuestionType === title),
            parent: container
        });

        questionType.add();
    });
}
// @END-File
