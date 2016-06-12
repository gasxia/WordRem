import { Carousel, Button, Row, Col, Tabs, Input, Icon, message } from 'antd';
import React from 'react';
var Slider = require('react-slick');


const TabPane = Tabs.TabPane;
function callback(key) {
  console.log(key);
}

class NextArrow extends React.Component {
    render(){
        return (
        <Button {...this.props} shape="circle-outline" icon="right" size="large" />
        );
    }
}

const NoteInput = React.createClass({
    getInitialState(){
        return {
            value:''
        };
    },
    handleInputChange(e){
        this.setState({
            value: e.target.value,
        });
    },
    handleClick(){
        this.state.value;
    },
    render(){
        const {  } = this.props;
        return(
            <div>
                <Input type="textarea" rows={4} value={this.state.value} onChange={this.handleInputChange} />
                <Button onClick={this.handleClick}>添加</Button>
            </div>
        )
    }
});


const LearnWord  = React.createClass({
    getInitialState(){
        return {
            show_word: 'hide',
            show_test: 'show'
        }
    },
    handleUnknowClick(){
      this.props.addUnknowWord(this.props.word);
      this.setState(
          {
              show_test:'hide',
              show_word:'show'
          }
      );
    },
    handleKnowClick(){
      this.setState(
          {
              show_test:'hide',
              show_word:'show'
          }
      )
    },
    render() {
        let word = this.props.word;
        let means_ol = word.means.map(function(item) {
            return (<li><span><b>{item.pos}.</b>{item.mean}</span></li>)
            }.bind(this));
        let ex_ol = word.exps.map(function(item) {
            return (<li><p>{item.eng}</p><p>{item.chn}</p></li>)
            }.bind(this));
        let mynote_ol =[];
        let note_ol = word.notes.map(function(item) {
            if(item.user == localStorage.getItem('username') ){
                mynote_ol.push(<li>{item.content}</li>);
            }
            return <li>{item.content}</li>;
        })
        return (
            <div>
                <Row type="flex" justify="center" align="middle">
                    <Col span={3}> </Col>
                    <Col span={18}><h1 className="content">{word.name}</h1></Col>
                </Row>
                <div className={this.state.show_word}>
                    <Row type="flex" justify="center" align="middle" className="row">
                        <Col span={3}><h6>单词解释</h6></Col>
                        <Col span={18}>
                            <ol type="1">
                                {means_ol}
                            </ol>
                        </Col>
                    </Row>
                    <Row type="flex" justify="center" align="middle" className="content" className="row">
                        <Col span={3}><h6>例句</h6></Col>
                        <Col span={18}>
                            <ol>
                                {ex_ol}
                            </ol>
                        </Col>
                    </Row>
                    <Row type="flex" justify="center" align="middle">
                        <Col span={3}><h6>笔记</h6></Col>
                        <Col span={18}>
                            <Tabs defaultActiveKey="1" onChange={callback}>
                                <TabPane tab="我的笔记" key="1">
                                    <ol type="1">
                                        {mynote_ol}
                                    </ol>
                                </TabPane>
                                <TabPane tab="共享笔记" key="2">
                                    <ol type="1">
                                        {note_ol}
                                    </ol>
                                </TabPane>
                                <TabPane tab="创建笔记" key="3">
                                    <NoteInput/>
                                </TabPane>
                            </Tabs>
                        </Col>
                    </Row>
                </div>
                <div className={this.state.show_test}>
                    <Row type="flex" justify="center" align="middle" className="btn">
                    <Col span={15}>
                        <Button type="primary" size="large" onClick={this.handleKnowClick} ><Icon type="smile-circle" />认  识</Button>
                        <Button type="primary" size="large" onClick={this.handleUnknowClick} ><Icon type="meh-circle" />不认识</Button>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
});

let Word = React.createClass({
    getInitialState(){
        return {
            wordlist: [],
            wordslider: [],
            count:0,
        }
    },
    getWordList()
    {
        $.ajax({
            type: 'get',
            url: '/wordlist'
        }).done(function (resp) {
            if (resp.status == "success") {
                this.setState({
                    wordlist: resp.wordlist,
                    count: resp.wordlist.length
                });
            }
        }.bind(this))
    },
    completeWordList(){

        $.ajax({
            type: 'get',
            url: '/complete'
        }).done(function (resp) {
            if (resp.status == "success") {
                message.success('保存成功');
            }
            else{
                message.error(resp.error);
            }
        }.bind(this));
    },
    addUnknowWord(word){
        this.setState(function (previousState, currentProps) {
            return {worlist: previousState.wordlist.push(word), count:previousState.count+1};
        });
    },
/*  beforeChange(currentSlide, nextSlide){
        if (nextSlide==this.state.count){
            console.log('完成');
        }
        console.log(currentSlide,nextSlide);
        console.log(this.state.count);
    },*/
    render()
    {
        let settings = {
            dots: true,
            arrows: true,
            nextArrow: <NextArrow />,
            infinite: false,
            beforeChange: this.beforeChange,
        };
        let wordslider = this.state.wordlist.map(function (item) {
            return (<div><LearnWord key={item.id} word={item} addUnknowWord={this.addUnknowWord}/></div>)
        }.bind(this));
        return (
            <div className='container'>
                <Button onClick={this.getWordList}>开始</Button>
                <Button onClick={this.completeWordList}>完成</Button>
                <Slider {...settings} className='slider'>
                    {wordslider}
                </Slider>
            </div>
        );
    }
});

module.exports = Word;

