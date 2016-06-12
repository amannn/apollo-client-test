import React, { Component } from 'react'
import gql from 'apollo-client/gql'
import { Link } from 'react-router'
import { connect } from 'react-apollo'

class Post extends Component {

  onSaveTitleClick = e => {
    let { mutations } = this.props
    e.preventDefault()
    let title = this.refs.title.value
    mutations.updatePost({ title })
      .then(({ errors }) => {
        if (errors) console.log(errors)
      }, err => {
        console.log(err)
      })
  };

  render() {
    let { postQuery: { loading, errors, result } } = this.props

    if (!result) {
      if (loading) return <div>Loading</div>
      if (errors) return <div>Errors: {JSON.stringify(errors)}</div>
    }

    let { post } = result

    return (
      <div className="Post">
        <Link to="/">Back to home</Link>
        <h1>{post.title}</h1>
        <p>{post.text}</p>
        <p>Tags: {post.tags.join(', ')}</p>
        <p>by {post.author.firstName} {post.author.lastName}</p>
        <hr />
        <p>
          Rename title to:
          {' '}
          <input type="text" ref="title" />
          {' '}
          <button onClick={this.onSaveTitleClick}>Save</button>
        </p>
      </div>
    )
  }
}

function mapQueriesToProps({ ownProps }) {
  return {
    postQuery: {
      query: gql`
        query getPost($postId: Int!) {
          post(postId: $postId) {
            id
            title
            text
            tags
            author {
              id
              firstName
              lastName
            }
          }
        }
      `,
      variables: { postId: ownProps.params.postId }
    }
  }
}

function mapMutationsToProps({ ownProps }) {
  return {
    updatePost: variables => ({
      mutation: gql`
        mutation updatePost($postId: Int!, $title: String) {
          updatePost(id: $postId, title: $title) {
            id
            title
          }
        }
      `,
      variables: { ...variables, postId: ownProps.params.postId }
    })
  }
}

export default connect({
  mapQueriesToProps,
  mapMutationsToProps
})(Post)
