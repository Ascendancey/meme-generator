//import React from 'react';
import './App.css';
import Meme from './Meme/Meme.js';
import Controls from './Controls/Controls.js';
import Login from './GoogleLogin/Login.js';
import Logout from './GoogleLogin/Logout.js';
import Comment from './Comment/Comment.js';
import React, {Component} from 'react';
import axios from 'axios';

//imports for CK editor
import {CKEditor} from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import parse from "html-react-parser";

// import html2canvas http://html2canvas.hertzen.com/
import html2canvas from 'html2canvas';

// import captionPosition object
import captionPosition from "./captionPosition";
import ImageOverview from "./ImageOverview";

//STATE
class App extends Component {
    state = {
        currentImageID: 0,
        currentTemplateID: 0,
        currentmeme: {
            url: "https://imgix.bustle.com/uploads/image/2018/5/14/aca8de5f-2ad2-4c99-ad2d-a97076c2eb8d-pigeon-meme-feature.jpg?w=1020&h=574&fit=crop&crop=faces&auto=format%2Ccompress",
            topcaption: "<p>Look at me</p>",
            bottomcaption: "<p>I am the captain now</p>",
            name: "This is the name of the meme",
            status: "1",
            title: "I'm the captain now!",
            topCaptionPosition: {
                left: 200,
                top: 535
            },
            bottomCaptionPosition: {
                left: 297,
                top: 335
            }
        },
        apiResponse: [],
        imgflipResponse: [],
        GIPHYresponse: [],
        templates: [],
        templateResponse: [],
        userhistorymeme: {},
        comment: {},
        comments: [],
        votes: []
    }

    // handling changed URL in input field
    urlChangedHandler = (event) => {
        this.setState({
            currentmeme: {
                ...this.state.currentmeme,
                url: event.target.value
            }
        })
    }

    // handling of FORWARD button, switching saved memes
    forwardButtonHandler = () => {
        if (this.state.currentImageID !== this.state.apiResponse.length - 1) {
            this.setState({currentImageID: this.state.currentImageID + 1}, () => this.updateMeme())
        }
    }

    // handling of BACK button, switching saved memes
    backButtonHandler = () => {
        if (this.state.currentImageID !== 0) {
            this.setState({currentImageID: this.state.currentImageID - 1}, () => this.updateMeme())
        }
    }

    // handling of TEMPLATE FORWARD button, switching received template images
    forwardTemplateHandler = () => {
        if (this.state.currentTemplateID !== this.state.imgflipResponse.length - 1) {
            this.setState({currentTemplateID: this.state.currentTemplateID + 1}, () => this.updateTemplate())
        }
    }

    // handling of TEMPLATE BACK button, switching received template images
    backTemplateHandler = () => {
        if (this.state.currentTemplateID !== 0) {
            this.setState({currentTemplateID: this.state.currentTemplateID - 1}, () => this.updateTemplate())
        }
    }

    // updating the meme after forwardButtonHandler / backButtonHandler (FORWARD/BACK buttons)
    // We defined another id here because react was rendering some parts before the others
    updateMeme = () => {
        this.setState({
            currentmeme:
                {
                    ...this.state.currentmeme,
                    id: this.state.currentImageID,
                    _id: this.state.apiResponse[this.state.currentImageID]._id,
                    url: this.state.apiResponse[this.state.currentImageID].url,
                    topcaption: this.state.apiResponse[this.state.currentImageID].topCaption,
                    bottomcaption: this.state.apiResponse[this.state.currentImageID].bottomCaption,
                    name: this.state.apiResponse[this.state.currentImageID].name,
                    title: this.state.apiResponse[this.state.currentImageID].title,
                    bottomCaptionPosition: this.state.apiResponse[this.state.currentImageID].bottomCaptionPosition,
                    topCaptionPosition: this.state.apiResponse[this.state.currentImageID].topCaptionPosition
                }
        });
    }

    // updating the meme after forwardTemplateHandler / backTemplateHandler (FORWARD TEMPLATE/BACK TEMPLATE buttons)
    updateTemplate = () => {
        this.setState({
            currentmeme:
                {
                    ...this.state.currentmeme,
                    url: this.state.imgflipResponse[this.state.currentTemplateID].url,
                    name: this.state.apiResponse[this.state.currentImageID].name
                }
        })
    }

    // handling the template selector change
    templateSelectorHandler = (event) => {
        this.setState({
            currentmeme:
                {
                    ...this.state.currentmeme,
                    url: this.state.imgflipResponse[event.target.value].url
                }
        })
    }

    // handling the GIF template selector change
    GIFSelectorHandler = (event) => {
        this.setState({
            currentmeme:
                {
                    ...this.state.currentmeme,
                    url: this.state.GIPHYresponse[event.target.value].images.original.url
                }
        })
    }

    // handling the privacy setting of the meme
    memePrivacyHandler = (event) => {
        this.setState({
            currentmeme:
                {
                    ...this.state.currentmeme,
                    status: event.target.value
                }
        })
    }

    // handling the selected meme from user history
    userHistoryMemeSelectHandler = (event) => {
        this.setState({
            userhistorymeme:
                {
                    _id: event.target.value,
                    url: this.state.apiResponse.filter(meme => meme._id === event.target.value)[0].url,
                    topcaption: this.state.apiResponse.filter(meme => meme._id === event.target.value)[0].topcaption,
                    bottomCaption: this.state.apiResponse.filter(meme => meme._id === event.target.value)[0].bottomCaption
                }
        })
    }

    //sets the title of the meme when we write text in the input field
    titleChangedHandler = (event) => {
        this.setState({
            currentmeme: {
                ...this.state.currentmeme,
                title: event.target.value
            }
        })
    }

    // screenshot the current meme via html2canvas and save it as PNG
    generatePNG = () => {
        html2canvas(document.querySelector("#meme"), {
            useCORS: true,
            // html2canvas requires some extra configuration in order work with selected elements https://github.com/niklasvh/html2canvas/issues/1878
            scrollX: -window.scrollX,
            scrollY: -window.scrollY,
            windowWidth: document.querySelector("#meme").offsetWidth,
            windowHeight: document.querySelector("#meme").offsetHeight}).then(canvas => {
            // display the generated screenshot
            document.body.appendChild(canvas);
            // get a base64 data string + open the data string in the current window
            //document.location.href = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
            // construct the download Link
            let url = canvas.toDataURL("image/png");
            let link = document.createElement("a");
            link.innerHTML = "Download PNG"
            link.download = "meme_" + new Date().getTime() + ".png";
            link.href = url;
            // append the link to the page
            document.body.appendChild(link);
        })
    }

    // saving meme (pushing to database)
    saveMeme = () => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: this.state.apiResponse[this.state.currentImageID].name,
                url: this.state.currentmeme.url,
                width: this.state.apiResponse[this.state.currentImageID].width,
                height: this.state.apiResponse[this.state.currentImageID].height,
                topCaption: this.state.currentmeme.topcaption,
                bottomCaption: this.state.currentmeme.bottomcaption,
                arialabel: this.state.apiResponse[this.state.currentImageID].name,
                user: this.state.user.email,
                status: this.state.currentmeme.status,
                title: this.state.currentmeme.title,
                topCaptionPosition: this.state.currentmeme.topCaptionPosition,
                bottomCaptionPosition: this.state.currentmeme.bottomCaptionPosition,
                creationDate: new Date()

                // here go the additional parameters of meme
            })
        };

        fetch("http://192.168.0.182:9000/posts", requestOptions)
            .then(response => response.json())
        // .then(data => this.setState({ postId: data.id }));
    }

    // show random saved memes
    randomImg = () => {
        const min = 1;
        const max = this.state.apiResponse.length;
        const rand = Math.floor(min + Math.random() * (max - min));
        this.setState({currentImageID: rand}, () => this.updateMeme())
    }

    // updating state when image is selected
    fileChangedHandler = (event) => {
        this.setState({selectedFile: event.target.files[0]})
        // console.log(this.state.selectedFile)
    }

    // posting the image to backend
    uploadHandler = () => {
        const formData = new FormData()
        formData.append('templateUpload', this.state.selectedFile)
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        // console.log(formData)
        axios.post("http://192.168.0.182:9000/templates", formData, config)
            .then((response) => {
                alert("The file is successfully uploaded");
            })
            .catch((error) => {
            });
        this.getTemplatesAPI()
    }

    // updating state when user is logged in
    userHandler = (event) => {
        // console.log(event);
        this.setState({user: event}, () => console.log(this.state.user));
    }

    // updating state when comment is typed
    typeCommentHandler = (event) => {
      this.setState({comment: event.target.value});
    }

    // submitting comment to database
    submitComment = () => {
      const requestOptions = {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
              _id: this.state.currentmeme._id,
              user: this.state.user.email,
              comment: this.state.comment
          })

      };

      fetch("http://192.168.0.182:9000/comments", requestOptions)
          .then(response => response.json())
          .then(this.commentsAPI)
    }
      // .then(data => this.setState({ postId: data.id }));

    // submitting vote to database
    submitVote = () => {
          const requestOptions = {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                  _id: this.state.currentmeme._id,
                  user: this.state.user.email
              })
          };
    
          fetch("http://192.168.0.182:9000/votes", requestOptions)
              .then(response => response.json())
              .then(this.votesAPI)
      }

    // fetch data from backend
    callAPI() {
        fetch("http://192.168.0.182:9000/posts")
            .then(res => res.json())
            .then(res => {
                this.setState({apiResponse: res, isLoaded: true}, () => {
                    this.updateMeme();
                    // console.log(this.state.apiResponse)
                });
            })
    }

    // fetch top meme templates from imgflip
    imgflipAPI() {
        fetch("https://api.imgflip.com/get_memes")
            .then(res => res.json())
            .then(res => {
                this.setState({imgflipResponse: res.data.memes, imgflipIsLoaded: true});
            })
    }

    // fetch gifs from GIPHLY
    giphlyAPI() {
        fetch("https://api.giphy.com/v1/gifs/trending?api_key=C2jh5iNQXJGdLe2ULvQsKe6S7Nk12ik1")
            .then(res => res.json())
            .then(res => {
                this.setState({GIPHYresponse: res.data, GIPHYresponseIsLoaded: true});
            })
    }

    // fetch saved templates
    getTemplatesAPI() {
        fetch("http://192.168.0.182:9000/templates")
            .then(res => res.json())
            .then(res => {
                this.setState({templateResponse: res, templatesIsLoaded: true});
            })
    }

    // fetch comments
    commentsAPI = () => {
      fetch("http://192.168.0.182:9000/comments")
          .then(res => res.json())
          .then(res => {
              this.setState({comments: res});
          })
    }

    // fetch votes
    votesAPI = () => {
      fetch("http://192.168.0.182:9000/votes")
          .then(res => res.json())
          .then(res => {
              this.setState({votes: res});
          })
    }

    //sort Memes by newest/oldest creation date
    sortByNewest = () => {
        this.state.apiResponse.sort(function compare(a, b) {
            let dateA = new Date(a.creationDate);
            let dateB = new Date(b.creationDate);
            return dateA - dateB;
        }).reverse()
        this.updateMeme()
    }

    // initial call of APIs once the page is loaded
    componentDidMount() {
        this.callAPI()
        this.imgflipAPI()
        this.giphlyAPI()
        this.getTemplatesAPI()
        this.commentsAPI()
        this.votesAPI()
    }

    // Gets caption position and sets the state for the correct type of caption (bottom or top)
    updatePosition = (position, type) => {
        switch (type) {
            case captionPosition.TOP:
                this.setState({
                    currentmeme: {
                        ...this.state.currentmeme,
                        topCaptionPosition: position
                    }
                });
                break
            // no default
            case captionPosition.BOTTOM:
                this.setState({
                    currentmeme: {
                        ...this.state.currentmeme,
                        bottomCaptionPosition: position
                    }
                });
                break
            // no default
        }
    }

    // rendering the page
    render() {
        return (
            <div id="container">
                <h1>Meme Overview</h1>
                <ImageOverview images={this.state.apiResponse}></ImageOverview>
                <h1>Meme Generator</h1>
                {/* showing current meme number out of total number of saved memes */}
                {this.state.isLoaded && <h1>{this.state.currentImageID + 1} of {this.state.apiResponse.length}</h1>}
                <div className="splitscreen">
                    <div className="left">
                        {/* rendering Meme component */}
                        {this.state.isLoaded &&
                        <Meme key={this.state.currentmeme.id} updatePosition={this.updatePosition}
                              url={this.state.currentmeme.url}
                              topcaption={parse(this.state.currentmeme.topcaption)}
                              bottomcaption={parse(this.state.currentmeme.bottomcaption)}
                              name={this.state.currentmeme.name} title={this.state.currentmeme.title}
                              topInitialPosition={this.state.currentmeme.topCaptionPosition}
                              bottomInitialPosition={this.state.currentmeme.bottomCaptionPosition}
                        />}
                        <button id="generate" onClick={this.generatePNG} aria-label="Generate a new Image">Generate</button><br/>
                        {this.state.votes && <label>Upvotes: {this.state.votes.filter(vote => vote.memeid === this.state.currentmeme._id).length}</label> }
                        <button id="upvote" onClick={this.submitVote}>Upvote</button><br/>
                        {this.state.comments && 
                          this.state.comments.filter(comment => comment.memeid === this.state.currentmeme._id).map(filteredComments => (
                          <Comment name={filteredComments.user} text={filteredComments.comment} />))
                            }
                        {this.state.user && <div>
                          <label>Comment:</label>
                          <input type="text" onChange={this.typeCommentHandler}></input>
                          <button onClick={this.submitComment} >Submit</button>
                        </div>
                        }
                    </div>
                    <div className="right">
                        <label>Meme title: </label> <br/>
                        <input type="text" onChange={this.titleChangedHandler} value={this.state.currentmeme.title}/>
                        {/* WYSISYG tex editor for TOP caption*/}
                        {this.state.isLoaded &&
                        <div className="editor-wrapper">
                            <label>Top caption: </label> <br/>
                            <CKEditor
                                editor={ClassicEditor}
                                data={this.state.currentmeme.topcaption}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    this.setState({
                                        currentmeme: {
                                            ...this.state.currentmeme,
                                            topcaption: data
                                        }
                                    })
                                }}
                            />
                        </div>}
                        {/* WYSISYG text editor for Bottom caption*/}
                        {this.state.isLoaded &&
                        <div className="editor-wrapper">
                            <label>Bottom caption: </label> <br/>
                            <CKEditor
                                editor={ClassicEditor}
                                data={this.state.currentmeme.bottomcaption}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    this.setState({
                                        currentmeme: {
                                            ...this.state.currentmeme,
                                            bottomcaption: data
                                        }
                                    })
                                }}
                            />
                        </div> }
                        <Controls url={this.state.currentmeme.url} urlchange={this.urlChangedHandler}/>
                        <div id="buttonWrapper">
                            {/* selector for meme and GIF templates */}
                            <label>
                                Get Meme template:
                            </label>
                            <select onChange={this.templateSelectorHandler}>
                                {this.state.imgflipResponse.map((item, i) => {
                                    return (<option value={i}> {item.name} </option>)
                                })}
                            </select>
                            <br/>
                            <label>
                                Get GIF:
                            </label>
                            <select onChange={this.GIFSelectorHandler}>
                                {this.state.GIPHYresponse.map((item, i) => {
                                    return (<option value={i}> {item.title} </option>)
                                })}
                            </select>
                            <br/>
                            <button onClick={this.switchCaption} aria-label="switch the caption">Caption</button>
                            <br/>
                            <select onChange={this.memePrivacyHandler} aria-label="Select meme privacy level">
                                <option value="1">Private</option>
                                <option value="2">Unlisted</option>
                                <option value="3">Public</option>
                            </select>
                            <br/>
                            <button id="save" onClick={this.saveMeme} aria-label="save the Meme">Save</button>
                            <br/>
                            <button id="randomimg" onClick={this.randomImg} aria-label="show a random image">Random
                                Image
                            </button>
                            <br/>
                            <button id="prevtemplate" onClick={this.backTemplateHandler}
                                    aria-label="show the previous meme">❮
                            </button>
                            <label>Template</label>
                            <button id="nexttemplate" onClick={this.forwardTemplateHandler}
                                    aria-label="show the next meme">❯
                            </button>
                            <br/>
                            <input type="file" name="templateUpload" onChange={this.fileChangedHandler}/>
                            <button onClick={this.uploadHandler} aria-label="Upload a picture">Upload!</button>
                            <br/>
                        </div>
                    </div>
                </div>
                <h1>User specific</h1>
                {/* login & logout components */}
                <Login userData={this.userHandler}/>
                <Logout/>
                {this.state.user &&
                <div className="splitscreen">
                    <div className="left">
                    
                    <h3>Memes created by you</h3>
                    
                    {this.state.user &&
                    <ol>
                        {this.state.apiResponse.filter(meme => meme.user === this.state.user.email).map(filteredMemes => (
                            <li>{filteredMemes.title}</li>
                        ))}
                    </ol>}
                    </div>
                        {/*<Meme url={this.state.userhistorymeme.url}
                              topcaption={this.state.userhistorymeme.topcaption}
                              bottomcaption={this.state.userhistorymeme.bottomcaption}/>*/}

                    <div className="right">
                        {/* {this.state.user &&
                        <select onChange={this.userHistoryMemeSelectHandler}>
                            {this.state.apiResponse.filter(meme => meme.user === this.state.user.email).map(filteredMemes => (
                                <option
                                    value={filteredMemes._id}>{filteredMemes.name + "-" + filteredMemes.topCaption + "-" + filteredMemes.bottomCaption}</option>
                            ))}
                        </select>} */}

                    </div>
                </div>}
                <button id="backButton" onClick={this.backButtonHandler} aria-label="Show previous meme">❮</button>
                <button id="nextButton" onClick={this.forwardButtonHandler} aria-label="Show next meme">❯</button>
                <button onClick={this.sortByNewest} aria-label="Sort memes by newsest/oldest">Sort by Newest/Oldest</button>
            </div>
        );
    }
}

export default App;
