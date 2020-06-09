const data1 = {
    text : '新建主题',
    children : [
        {
            text : '子主题1',
        },
        {
            text : '子主题2',
        },
        {
            text : '子主题3',
        },
        {
            text : '子主题4',
            children : [
                {
                    text : '子主题4 - 1',
                },
                {
                    text : '子主题4 - 2',
                },
                {
                    text : '子主题4 - 3',
                },
            ],
        },
    ],
};
const data2 = {
    text : 'Modeling Methods',
    children : [
        {
            text : 'ClassificationClassification',
            children : [
                {
                    text : `Different in`,
                    link : 'http://baidu.com/',
                    mark : ['priority:1', 'priority:2', 'star:red'],
                },
                {
                    text : 'Linear discriminant analysis',
                    tag : ['标签1', '标签2', '标签2', '标签2', '标签2', '标签2'],
                },
                {
                    text : 'Decision trees',
                    note : '123',
                },
                {
                    text : 'Decision trees',
                    link : 'http://baidu.com',
                },
                {
                    text : 'Decision trees',
                    note : '123',
                    link : 'http://baidu.com',
                },
                {
                    text : 'Decision trees',
                },
                {
                    text : 'Probabilistic neural network',
                },
                {
                    text : 'Support vector machine',
                },
            ],
        },
        {
            text : 'Consensus',
            children : [
                {
                    text : 'Models diversity',
                    children : [
                        {
                            text : 'Different initializations',
                            link : 'http://baidu.com/',
                        },
                        {
                            text : 'Different parameter choices',
                        },
                        {
                            text : 'Different architectures',
                        },
                        {
                            text : 'Different modeling methods',
                        },
                        {
                            text : 'Different training sets',
                        },
                        {
                            text : 'Different feature sets',
                        },
                    ],
                },
                {
                    text : 'Methods',
                    children : [
                        {
                            text : 'Classifier selection',
                        },
                        {
                            text : 'Classifier fusion',
                        },
                    ],
                },
                {
                    text : 'Common',
                    children : [
                        {
                            text : 'Bagging',
                        },
                        {
                            text : 'Boosting',
                        },
                        {
                            text : 'AdaBoost',
                        },
                    ],
                },
            ],
        },
        {
            text : 'Regression',
            children : [
                {
                    text : 'Multiple linear regression',
                },
                {
                    text : 'Partial least squares',
                },
                {
                    text : 'Multi-layer feedforward neural network',
                },
                {
                    text : 'General regression neural network',
                },
                {
                    text : 'Support vector regression',
                },
            ],
        },
    ],
};

const bigdata = {
    text : 'Modeling Methods',
    children : [
        {
            text : 'ClassificationClassification',
            children : [
                {
                    text : `Different in`,
                    link : 'http://baidu.com/',
                    mark : ['priority:1', 'priority:2', 'star:red'],
                },
                {
                    text : 'Linear discriminant analysis',
                    tag : ['标签1', '标签2'],
                },
                {
                    text : 'Decision trees',
                    note : '123',
                },
                {
                    text : 'Decision trees',
                    link : 'http://baidu.com',
                },
                {
                    text : 'Decision trees',
                    note : '123',
                    link : 'http://baidu.com',
                },
                {
                    text : 'Decision trees',
                },
                {
                    text : 'Probabilistic neural network',
                },
                {
                    text : 'Support vector machine',
                },
            ],
        },
        {
            text : 'Consensus',
            children : [
                {
                    text : 'Models diversity',
                    children : [
                        {
                            text : 'Different initializations',
                            link : 'http://baidu.com/',
                        },
                        {
                            text : 'Different parameter choices',
                        },
                        {
                            text : 'Different architectures',
                        },
                        {
                            text : 'Different modeling methods',
                        },
                        {
                            text : 'Different training sets',
                        },
                        {
                            text : 'Different feature sets',
                        },
                    ],
                },
                {
                    text : 'Methods',
                    children : [
                        {
                            text : 'Classifier selection',
                        },
                        {
                            text : 'Classifier fusion',
                        },
                    ],
                },
                {
                    text : 'Common',
                    children : [
                        {
                            text : 'Bagging',
                        },
                        {
                            text : 'Boosting',
                        },
                        {
                            text : 'AdaBoost',
                        },
                    ],
                },
            ],
        },
        {
            text : 'Regression',
            children : [
                {
                    text : 'Multiple linear regression',
                },
                {
                    text : 'Partial least squares',
                },
                {
                    text : 'Multi-layer feedforward neural network',
                },
                {
                    text : 'General regression neural network',
                },
                {
                    text : 'Support vector regression',
                },
                {
                    text : 'Modeling Methods',
                    children : [
                        {
                            text : 'ClassificationClassification',
                            children : [
                                {
                                    text : `Different in`,
                                    link : 'http://baidu.com/',
                                    mark : ['priority:1', 'priority:2', 'star:red'],
                                },
                                {
                                    text : 'Linear discriminant analysis',
                                    tag : ['标签1', '标签2'],
                                },
                                {
                                    text : 'Decision trees',
                                    note : '123',
                                },
                                {
                                    text : 'Decision trees',
                                    link : 'http://baidu.com',
                                },
                                {
                                    text : 'Decision trees',
                                    note : '123',
                                    link : 'http://baidu.com',
                                },
                                {
                                    text : 'Decision trees',
                                },
                                {
                                    text : 'Probabilistic neural network',
                                },
                                {
                                    text : 'Support vector machine',
                                },
                            ],
                        },
                        {
                            text : 'Consensus',
                            children : [
                                {
                                    text : 'Models diversity',
                                    children : [
                                        {
                                            text : 'Different initializations',
                                            link : 'http://baidu.com/',
                                        },
                                        {
                                            text : 'Different parameter choices',
                                        },
                                        {
                                            text : 'Different architectures',
                                        },
                                        {
                                            text : 'Different modeling methods',
                                        },
                                        {
                                            text : 'Different training sets',
                                        },
                                        {
                                            text : 'Different feature sets',
                                        },
                                    ],
                                },
                                {
                                    text : 'Methods',
                                    children : [
                                        {
                                            text : 'Classifier selection',
                                        },
                                        {
                                            text : 'Classifier fusion',
                                        },
                                    ],
                                },
                                {
                                    text : 'Common',
                                    children : [
                                        {
                                            text : 'Bagging',
                                        },
                                        {
                                            text : 'Boosting',
                                        },
                                        {
                                            text : 'AdaBoost',
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            text : 'Regression',
                            children : [
                                {
                                    text : 'Multiple linear regression',
                                },
                                {
                                    text : 'Partial least squares',
                                },
                                {
                                    text : 'Multi-layer feedforward neural network',
                                },
                                {
                                    text : 'General regression neural network',
                                },
                                {
                                    text : 'Support vector regression',
                                },
                            ],
                        },
                    ],
                },
                {
                    text : 'Modeling Methods',
                    children : [
                        {
                            text : 'ClassificationClassification',
                            children : [
                                {
                                    text : `Different in`,
                                    link : 'http://baidu.com/',
                                    mark : ['priority:1', 'priority:2', 'star:red'],
                                },
                                {
                                    text : 'Linear discriminant analysis',
                                    tag : ['标签1', '标签2'],
                                },
                                {
                                    text : 'Decision trees',
                                    note : '123',
                                },
                                {
                                    text : 'Decision trees',
                                    link : 'http://baidu.com',
                                },
                                {
                                    text : 'Decision trees',
                                    note : '123',
                                    link : 'http://baidu.com',
                                },
                                {
                                    text : 'Decision trees',
                                },
                                {
                                    text : 'Probabilistic neural network',
                                },
                                {
                                    text : 'Support vector machine',
                                },
                            ],
                        },
                        {
                            text : 'Consensus',
                            children : [
                                {
                                    text : 'Models diversity',
                                    children : [
                                        {
                                            text : 'Different initializations',
                                            link : 'http://baidu.com/',
                                        },
                                        {
                                            text : 'Different parameter choices',
                                        },
                                        {
                                            text : 'Different architectures',
                                        },
                                        {
                                            text : 'Different modeling methods',
                                        },
                                        {
                                            text : 'Different training sets',
                                        },
                                        {
                                            text : 'Different feature sets',
                                        },
                                    ],
                                },
                                {
                                    text : 'Methods',
                                    children : [
                                        {
                                            text : 'Classifier selection',
                                        },
                                        {
                                            text : 'Classifier fusion',
                                        },
                                    ],
                                },
                                {
                                    text : 'Common',
                                    children : [
                                        {
                                            text : 'Bagging',
                                        },
                                        {
                                            text : 'Boosting',
                                        },
                                        {
                                            text : 'AdaBoost',
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            text : 'Regression',
                            children : [
                                {
                                    text : 'Multiple linear regression',
                                },
                                {
                                    text : 'Partial least squares',
                                },
                                {
                                    text : 'Multi-layer feedforward neural network',
                                },
                                {
                                    text : 'General regression neural network',
                                },
                                {
                                    text : 'Support vector regression',
                                },
                            ],
                        },
                    ],
                },
                {
                    text : 'Modeling Methods',
                    children : [
                        {
                            text : 'ClassificationClassification',
                            children : [
                                {
                                    text : `Different in`,
                                    link : 'http://baidu.com/',
                                    mark : ['priority:1', 'priority:2', 'star:red'],
                                },
                                {
                                    text : 'Linear discriminant analysis',
                                    tag : ['标签1', '标签2'],
                                },
                                {
                                    text : 'Decision trees',
                                    note : '123',
                                },
                                {
                                    text : 'Decision trees',
                                    link : 'http://baidu.com',
                                },
                                {
                                    text : 'Decision trees',
                                    note : '123',
                                    link : 'http://baidu.com',
                                },
                                {
                                    text : 'Decision trees',
                                },
                                {
                                    text : 'Probabilistic neural network',
                                },
                                {
                                    text : 'Support vector machine',
                                },
                            ],
                        },
                        {
                            text : 'Consensus',
                            children : [
                                {
                                    text : 'Models diversity',
                                    children : [
                                        {
                                            text : 'Different initializations',
                                            link : 'http://baidu.com/',
                                        },
                                        {
                                            text : 'Different parameter choices',
                                        },
                                        {
                                            text : 'Different architectures',
                                        },
                                        {
                                            text : 'Different modeling methods',
                                        },
                                        {
                                            text : 'Different training sets',
                                        },
                                        {
                                            text : 'Different feature sets',
                                        },
                                    ],
                                },
                                {
                                    text : 'Methods',
                                    children : [
                                        {
                                            text : 'Classifier selection',
                                        },
                                        {
                                            text : 'Classifier fusion',
                                        },
                                    ],
                                },
                                {
                                    text : 'Common',
                                    children : [
                                        {
                                            text : 'Bagging',
                                        },
                                        {
                                            text : 'Boosting',
                                        },
                                        {
                                            text : 'AdaBoost',
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            text : 'Regression',
                            children : [
                                {
                                    text : 'Multiple linear regression',
                                },
                                {
                                    text : 'Partial least squares',
                                },
                                {
                                    text : 'Multi-layer feedforward neural network',
                                },
                                {
                                    text : 'General regression neural network',
                                },
                                {
                                    text : 'Support vector regression',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
};

export const testData = {
    data1,
    data2,
    bigdata,
};
