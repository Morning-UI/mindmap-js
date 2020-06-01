<template>
    <div class="mindmap">
        <div class="mindmap-canvas"></div>
        <div class="mindmap-editor">
            <textarea
                v-model="editContent"
                @input="editorInput"
                @mouseup.native="editorInput"
                @keydown.native="editorInput"
            ></textarea>
        </div>
        <div class="mindmap-menu-link">
            <a @click="menuLinkEdit">编辑</a>
            <i class="line"></i>
            <a @click="menuLinkDelete">删除</a>
        </div>
        <div class="mindmap-box-edit-link">
            <i class="arrow"></i>
            <h3>编辑链接</h3>
            <textarea rows="3"></textarea>
        </div>
    </div>
</template>

<script>
import {
    default as Mindmap,
    EventNamesEnum,
}                                               from 'mindmap-core';

export default {
    data : function () {
        return {
            mindmap : null,
            editContent : ''
        };
    },
    methods : {
        editorInput : function (evt) {
            if (this.mindmap) {
                this.mindmap.editorInput(evt.srcElement.value);
            }
        },
        menuLinkDelete : function () {

            this.mindmap.unlink(this.mindmap.getContextNodeId());
            this.mindmap.hideContextMenu(this.mindmap.getContextType());

        },
        menuLinkEdit : function () {
            this.mindmap.showEditLink(this.mindmap.getContextNodeId());
            this.mindmap.hideContextMenu(this.mindmap.getContextType());
        }
    },
    mounted : function () {
        let data1 = {
            text : '新建主题',
            children : [
                {text: '子主题1'},
                {text: '子主题2'},
                {text: '子主题3'},
                {
                    text: '子主题4',
                    children : [
                        {text: '子主题4 - 1'},
                        {text: '子主题4 - 2'},
                        {text: '子主题4 - 3'},
                    ]
                },
            ]
        };
        let data2 = {
            text : 'Modeling Methods',
            children : [
                {
                    text : 'ClassificationClassification',
                    children : [
                        {
                            text : `Different in`,
                            link : 'http://baidu.com/',
                            mark : ['priority:1', 'priority:2', 'star:red']
                        },
                        {
                            text : 'Linear discriminant analysis',
                            tag : ['标签1', '标签2']
                        },
                        {
                            text : 'Decision trees',
                            note : '123'
                        },
                        {
                            text : 'Decision trees',
                            link : 'http://baidu.com'
                        },
                        {
                            text : 'Decision trees',
                            note : '123',
                            link : 'http://baidu.com'
                        },
                        {
                            text : 'Decision trees'
                        },
                        {
                            text : 'Probabilistic neural network'
                        },
                        {
                            text : 'Support vector machine'
                        }
                    ]
                },
                {
                    text : 'Consensus',
                    children : [
                        {
                            text : 'Models diversity',
                            children : [
                                {
                                    text : 'Different initializations',
                                    link : 'http://baidu.com/'
                                },
                                {
                                    text : 'Different parameter choices'
                                },
                                {
                                    text : 'Different architectures'
                                },
                                {
                                    text : 'Different modeling methods'
                                },
                                {
                                    text : 'Different training sets'
                                },
                                {
                                    text : 'Different feature sets'
                                }
                            ]
                        },
                        {
                            text : 'Methods',
                            children : [
                                {
                                    text : 'Classifier selection'
                                },
                                {
                                    text : 'Classifier fusion'
                                }
                            ]
                        },
                        {
                            text : 'Common',
                            children : [
                                {
                                    text : 'Bagging'
                                },
                                {
                                    text : 'Boosting'
                                },
                                {
                                    text : 'AdaBoost'
                                }
                            ]
                        }
                    ]
                },
                {
                    text : 'Regression',
                    children : [
                        {
                            text : 'Multiple linear regression'
                        },
                        {
                            text : 'Partial least squares'
                        },
                        {
                            text : 'Multi-layer feedforward neural network'
                        },
                        {
                            text : 'General regression neural network'
                        },
                        {
                            text : 'Support vector regression'
                        }
                    ]
                },
            ]
        };
        let biddata= {
            text : 'Modeling Methods',
            children : [
                {
                    text : 'ClassificationClassification',
                    children : [
                        {
                            text : `Different in`,
                            link : 'http://baidu.com/',
                            mark : ['priority:1', 'priority:2', 'star:red']
                        },
                        {
                            text : 'Linear discriminant analysis',
                            tag : ['标签1', '标签2']
                        },
                        {
                            text : 'Decision trees',
                            note : '123'
                        },
                        {
                            text : 'Decision trees',
                            link : 'http://baidu.com'
                        },
                        {
                            text : 'Decision trees',
                            note : '123',
                            link : 'http://baidu.com'
                        },
                        {
                            text : 'Decision trees'
                        },
                        {
                            text : 'Probabilistic neural network'
                        },
                        {
                            text : 'Support vector machine'
                        }
                    ]
                },
                {
                    text : 'Consensus',
                    children : [
                        {
                            text : 'Models diversity',
                            children : [
                                {
                                    text : 'Different initializations',
                                    link : 'http://baidu.com/'
                                },
                                {
                                    text : 'Different parameter choices'
                                },
                                {
                                    text : 'Different architectures'
                                },
                                {
                                    text : 'Different modeling methods'
                                },
                                {
                                    text : 'Different training sets'
                                },
                                {
                                    text : 'Different feature sets'
                                }
                            ]
                        },
                        {
                            text : 'Methods',
                            children : [
                                {
                                    text : 'Classifier selection'
                                },
                                {
                                    text : 'Classifier fusion'
                                }
                            ]
                        },
                        {
                            text : 'Common',
                            children : [
                                {
                                    text : 'Bagging'
                                },
                                {
                                    text : 'Boosting'
                                },
                                {
                                    text : 'AdaBoost'
                                }
                            ]
                        }
                    ]
                },
                {
                    text : 'Regression',
                    children : [
                        {
                            text : 'Multiple linear regression'
                        },
                        {
                            text : 'Partial least squares'
                        },
                        {
                            text : 'Multi-layer feedforward neural network'
                        },
                        {
                            text : 'General regression neural network'
                        },
                        {
                            text : 'Support vector regression'
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
                                            mark : ['priority:1', 'priority:2', 'star:red']
                                        },
                                        {
                                            text : 'Linear discriminant analysis',
                                            tag : ['标签1', '标签2']
                                        },
                                        {
                                            text : 'Decision trees',
                                            note : '123'
                                        },
                                        {
                                            text : 'Decision trees',
                                            link : 'http://baidu.com'
                                        },
                                        {
                                            text : 'Decision trees',
                                            note : '123',
                                            link : 'http://baidu.com'
                                        },
                                        {
                                            text : 'Decision trees'
                                        },
                                        {
                                            text : 'Probabilistic neural network'
                                        },
                                        {
                                            text : 'Support vector machine'
                                        }
                                    ]
                                },
                                {
                                    text : 'Consensus',
                                    children : [
                                        {
                                            text : 'Models diversity',
                                            children : [
                                                {
                                                    text : 'Different initializations',
                                                    link : 'http://baidu.com/'
                                                },
                                                {
                                                    text : 'Different parameter choices'
                                                },
                                                {
                                                    text : 'Different architectures'
                                                },
                                                {
                                                    text : 'Different modeling methods'
                                                },
                                                {
                                                    text : 'Different training sets'
                                                },
                                                {
                                                    text : 'Different feature sets'
                                                }
                                            ]
                                        },
                                        {
                                            text : 'Methods',
                                            children : [
                                                {
                                                    text : 'Classifier selection'
                                                },
                                                {
                                                    text : 'Classifier fusion'
                                                }
                                            ]
                                        },
                                        {
                                            text : 'Common',
                                            children : [
                                                {
                                                    text : 'Bagging'
                                                },
                                                {
                                                    text : 'Boosting'
                                                },
                                                {
                                                    text : 'AdaBoost'
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    text : 'Regression',
                                    children : [
                                        {
                                            text : 'Multiple linear regression'
                                        },
                                        {
                                            text : 'Partial least squares'
                                        },
                                        {
                                            text : 'Multi-layer feedforward neural network'
                                        },
                                        {
                                            text : 'General regression neural network'
                                        },
                                        {
                                            text : 'Support vector regression'
                                        }
                                    ]
                                },
                            ]
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
                                            mark : ['priority:1', 'priority:2', 'star:red']
                                        },
                                        {
                                            text : 'Linear discriminant analysis',
                                            tag : ['标签1', '标签2']
                                        },
                                        {
                                            text : 'Decision trees',
                                            note : '123'
                                        },
                                        {
                                            text : 'Decision trees',
                                            link : 'http://baidu.com'
                                        },
                                        {
                                            text : 'Decision trees',
                                            note : '123',
                                            link : 'http://baidu.com'
                                        },
                                        {
                                            text : 'Decision trees'
                                        },
                                        {
                                            text : 'Probabilistic neural network'
                                        },
                                        {
                                            text : 'Support vector machine'
                                        }
                                    ]
                                },
                                {
                                    text : 'Consensus',
                                    children : [
                                        {
                                            text : 'Models diversity',
                                            children : [
                                                {
                                                    text : 'Different initializations',
                                                    link : 'http://baidu.com/'
                                                },
                                                {
                                                    text : 'Different parameter choices'
                                                },
                                                {
                                                    text : 'Different architectures'
                                                },
                                                {
                                                    text : 'Different modeling methods'
                                                },
                                                {
                                                    text : 'Different training sets'
                                                },
                                                {
                                                    text : 'Different feature sets'
                                                }
                                            ]
                                        },
                                        {
                                            text : 'Methods',
                                            children : [
                                                {
                                                    text : 'Classifier selection'
                                                },
                                                {
                                                    text : 'Classifier fusion'
                                                }
                                            ]
                                        },
                                        {
                                            text : 'Common',
                                            children : [
                                                {
                                                    text : 'Bagging'
                                                },
                                                {
                                                    text : 'Boosting'
                                                },
                                                {
                                                    text : 'AdaBoost'
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    text : 'Regression',
                                    children : [
                                        {
                                            text : 'Multiple linear regression'
                                        },
                                        {
                                            text : 'Partial least squares'
                                        },
                                        {
                                            text : 'Multi-layer feedforward neural network'
                                        },
                                        {
                                            text : 'General regression neural network'
                                        },
                                        {
                                            text : 'Support vector regression'
                                        }
                                    ]
                                },
                            ]
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
                                            mark : ['priority:1', 'priority:2', 'star:red']
                                        },
                                        {
                                            text : 'Linear discriminant analysis',
                                            tag : ['标签1', '标签2']
                                        },
                                        {
                                            text : 'Decision trees',
                                            note : '123'
                                        },
                                        {
                                            text : 'Decision trees',
                                            link : 'http://baidu.com'
                                        },
                                        {
                                            text : 'Decision trees',
                                            note : '123',
                                            link : 'http://baidu.com'
                                        },
                                        {
                                            text : 'Decision trees'
                                        },
                                        {
                                            text : 'Probabilistic neural network'
                                        },
                                        {
                                            text : 'Support vector machine'
                                        }
                                    ]
                                },
                                {
                                    text : 'Consensus',
                                    children : [
                                        {
                                            text : 'Models diversity',
                                            children : [
                                                {
                                                    text : 'Different initializations',
                                                    link : 'http://baidu.com/'
                                                },
                                                {
                                                    text : 'Different parameter choices'
                                                },
                                                {
                                                    text : 'Different architectures'
                                                },
                                                {
                                                    text : 'Different modeling methods'
                                                },
                                                {
                                                    text : 'Different training sets'
                                                },
                                                {
                                                    text : 'Different feature sets'
                                                }
                                            ]
                                        },
                                        {
                                            text : 'Methods',
                                            children : [
                                                {
                                                    text : 'Classifier selection'
                                                },
                                                {
                                                    text : 'Classifier fusion'
                                                }
                                            ]
                                        },
                                        {
                                            text : 'Common',
                                            children : [
                                                {
                                                    text : 'Bagging'
                                                },
                                                {
                                                    text : 'Boosting'
                                                },
                                                {
                                                    text : 'AdaBoost'
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    text : 'Regression',
                                    children : [
                                        {
                                            text : 'Multiple linear regression'
                                        },
                                        {
                                            text : 'Partial least squares'
                                        },
                                        {
                                            text : 'Multi-layer feedforward neural network'
                                        },
                                        {
                                            text : 'General regression neural network'
                                        },
                                        {
                                            text : 'Support vector regression'
                                        }
                                    ]
                                },
                            ]
                        }
                    ]
                },
            ]
        };

        this.mindmap = new Mindmap({
            $con : this.$el,
            $canvas : this.$el.querySelector('.mindmap-canvas'),
            $editor : this.$el.querySelector('.mindmap-editor'),
        })
        .readData(data2)
        .on(EventNamesEnum.EditContentChange, (editContent) => {
            this.editContent = editContent;
        });

        window.test = this.mindmap;

    }
};
</script>