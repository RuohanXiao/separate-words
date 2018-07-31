import * as React from "react";
import { connect } from "react-redux";
import store from '../../state/store'
import { Layout, message } from "antd";
import HeaderNav from './HeaderNav'
import { Route, Switch } from "react-router-dom";
import util from '../../util'
import Main_UI from './Main'
import SiderNav_UI from './SiderNav'
import FooterBtn_UI from './FooterBtn'

const { Header, Content } = Layout;

// 组件的状态传递还没有优化好
let mapAllStateToProps = state => {
  return state
};

let mapStateToSeparateWordsProperty = state => {
  return {
    ...state,
    articlesContent: state.showArticle.separateWordsPropertyData.articlesContent,
    article: state.showArticle.separateWordsPropertyData.data
  }
}
let mapStateToSeparateWords = state => {
  return {
    ...state,
    articlesContent: state.showArticle.separateWordsData.articlesContent,
    article: state.showArticle.separateWordsData.data
  }
}
let mapStateToMarkEntity  = state => {
  return {
    ...state,
    articlesContent: state.showArticle.markEntityData.articlesContent,
    article: state.showArticle.markEntityData.data
  }
}
// 将 Main 组件公有的方法抽取出来
let mapDispathToMain = dispatch => {
  return {
    handleCancel: () => {
      dispatch({ type: 'CLOSE_MODAL' })
    },
    radioOnChange: (e) => {
      dispatch({
        type: 'SET_RADIO_VALUE',
        radioValue: e.target.value
      })
    }
  };
};
let mapDispathToSeparateWordsProperty = dispatch => {
  let publicDispathToMain = mapDispathToMain(dispatch)
  return {
    ...publicDispathToMain,
    handleOk: () => {
      let start = store.getState().selection.start
      let end = store.getState().selection.end
      let data = store.getState().showArticle.separateWordsPropertyData.data
      let type = store.getState().radioValue
      let groupIndex = 0
      if (data[start-1]) groupIndex = data[start-1].type == type ? data[start-1].groupIndex + 1 : 0 
      for (let i = start;i < end;i++) {
        data[i].type = type
        data[i].groupIndex = groupIndex
      }
      dispatch({ type: 'CLOSE_MODAL' })
    },
    pickWords: () => {
      if (window.getSelection().toString()) {
        let start = window.getSelection().getRangeAt(0).startContainer.parentElement.id
        let end = + window.getSelection().getRangeAt(0).endContainer.parentElement.id + 1
        let selectedContent = ''
        let data = store.getState().showArticle.separateWordsPropertyData.data
        for (let i = start;i < end;i++) {
          selectedContent += data[i].content
        }
        dispatch({ 
          type: "SET_SELECTION", 
          selection: {
             content: selectedContent,
             start,
             end
          } 
        })
        dispatch({ type: "OPEN_MODAL"})
      }
    }
  };
};
let mapDispathToSeparateWords = dispatch => {
  let publicDispathToMain = mapDispathToMain(dispatch)
  return {
    ...publicDispathToMain,
    handleOk: () => {},
    pickWords: () => {
      if (window.getSelection().toString()) {
        let start = window.getSelection().getRangeAt(0).startContainer.parentElement.id
        let end = + window.getSelection().getRangeAt(0).endContainer.parentElement.id + 1
        let selectedContent = ''
        let data = store.getState().showArticle.separateWordsData.data
        for (let i = start;i < end;i++) {
          selectedContent += data[i].content
        }
        dispatch({ 
          type: "SET_SELECTION", 
          selection: {
             content: selectedContent,
             start,
             end
          }
        })
        let type = util.getType(data, store.getState().typeArr, start, end-1)
        let selection = store.getState().selection
        for (let i = selection.start;i < selection.end;i++) {
          data[i].type = type
        }
      }
    }
  };
};
let mapDispathToMarkEntity = dispatch => {
  let publicDispathToMain = mapDispathToMain(dispatch)
  return {
    ...publicDispathToMain,
    handleOk: () => {},
    pickWords: () => {
      if (window.getSelection().toString()) {
        let start = window.getSelection().getRangeAt(0).startContainer.parentElement.id
        let end = + window.getSelection().getRangeAt(0).endContainer.parentElement.id + 1
        let selectedContent = ''
        let data = store.getState().showArticle.markEntityData.data
        for (let i = start;i < end;i++) {
          selectedContent += data[i].content
        }
        dispatch({ 
          type: "SET_SELECTION", 
          selection: {
             content: selectedContent,
             start,
             end
          }
        })
        let type = util.getType(data, store.getState().typeArr, start, end-1)
        let selection = store.getState().selection
        for (let i = selection.start;i < selection.end;i++) {
          data[i].type = type
        }
      }
    }
  };
};
let mapDispathToFooterBtn = dispatch => {
  return {
    save: () => {
      message.loading('Saving...', 2.5)
      .then(() => message.success('Save Successed!', 2.5))
    }
  }
}
let mapDispatchToSiderNav = dispatch => {
  return {
    handleClick: id => {
      let state = store.getState()
      let showArticle = state.articles.find(item => item.id == id).data
      dispatch({ type: "SET_SHOWARTICLE", showArticle })
    }
  }
}

let SeparateWordsProperty = connect(mapStateToSeparateWordsProperty, mapDispathToSeparateWordsProperty)(Main_UI)
let SeparateWords = connect(mapStateToSeparateWords, mapDispathToSeparateWords)(Main_UI)
let MarkEntity = connect(mapStateToMarkEntity, mapDispathToMarkEntity)(Main_UI)
let SiderNav = connect(mapAllStateToProps, mapDispatchToSiderNav)(SiderNav_UI)
let FooterBtn = connect(mapAllStateToProps, mapDispathToFooterBtn)(FooterBtn_UI)

class App extends React.Component {
  render() {
    return (
        <Layout style={{ minHeight: '100vh' }}>
          <Header>
            <HeaderNav></HeaderNav>
          </Header>
          <Content>
            <Layout style={{ minHeight: '90vh' }}>
              <SiderNav></SiderNav>
              <Layout style={{ padding: '15px' }}>
                <Content>
                  <Switch>
                    <Route path='/WorkTable/separate-words' component={ SeparateWords }></Route>
                    <Route path='/WorkTable/mark-entity' component={ MarkEntity }></Route>
                    <Route path='/WorkTable/separate-words-property' component={ SeparateWordsProperty }></Route>
                  </Switch>
                </Content>
                <FooterBtn></FooterBtn>
              </Layout>
            </Layout>
          </Content>
        </Layout>
    );
  }
}

export default App