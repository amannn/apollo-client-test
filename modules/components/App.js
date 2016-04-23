import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-apollo'

export default class App extends Component {

  onDeleteAuthorsClick = e => {
    const { mutations, authorsQuery } = this.props
    e.preventDefault()
    mutations.deleteAuthors()
      .then(({ errors }) => {
        if (errors) console.log(errors)
        else authorsQuery.refetch()
      }, err => {
        console.log(err)
      })
  }

  onAddPostClick = (authorId, e) => {
    const { mutations, authorsQuery } = this.props
    e.preventDefault()
    mutations.createPost(authorId)
      .then(({ errors }) => {
        if (errors) console.log(errors)
        else authorsQuery.refetch()
      }, err => {
        console.log(err)
      })
  }

  onAddAuthorClick = e => {
    const { mutations, authorsQuery } = this.props
    e.preventDefault()
    mutations.createAuthor()
      .then(({ errors }) => {
        if (errors) console.log(errors)
        else authorsQuery.refetch()
      }, err => {
        console.log(err)
      })
  };

  onCheesyTipRefreshClick = e => {
    e.preventDefault()
    this.props.cheesyTipQuery.refetch()
  }

  renderCheesyTip() {
    let { cheesyTipQuery: { loading, errors, result } } = this.props

    if (loading) return <div>Loading</div>
    if (errors) return <div>Errors: {JSON.stringify(errors)}</div>

    return (
      <div>
        <p>"{result.cheesyTip}"</p>
        <button onClick={this.onCheesyTipRefreshClick}>Refresh</button>
      </div>
    )
  }

  render() {
    let { authorsQuery: { loading, errors, result } } = this.props

    if (!result) {
      if (loading) return <div>Loading</div>
      if (errors) return <div>Errors: {JSON.stringify(errors)}</div>
    }

    return (
      <div>
        <h1>Authors</h1>
        {result.authors.map(author =>
          <div key={author.id}>
            <h3>{author.firstName} {author.lastName}</h3>
            <ul>
              {author.posts && author.posts.map(post =>
                <li key={post.id}>
                  <Link to={`posts/${post.id}`}>{post.title}</Link>
                </li>
              )}
            </ul>
            <button onClick={this.onAddPostClick.bind(this, author.id)}>
              Add post
            </button>
          </div>
        )}
        <hr />
        <button onClick={this.onAddAuthorClick}>Add author</button>
        <button onClick={this.onDeleteAuthorsClick}>Delete all authors</button>
        <h1>Cheesy tip of the day</h1>
        {this.renderCheesyTip()}
      </div>
    )
  }

}

/**
 * Store
 */

function mapQueriesToProps() {
  return {
    authorsQuery: {
      query: `
        {
          authors {
            id
            firstName
            lastName
            posts {
              id
              title
            }
          }
        }
      `,
      forceFetch: true
    },
    cheesyTipQuery: {
      query: `
        {
          cheesyTip: getFortuneCookie
        }
      `,
      forceFetch: true
    }
  }
}

function mapMutationsToProps() {
  return {
    createAuthor: (firstName, lastName) => ({
      mutation: `
        mutation createAuthor($firstName: String, $lastName: String) {
          createAuthor(firstName: $firstName, lastName: $lastName) {
            id
            firstName
            lastName
          }
        }
      `,
      variables: { firstName, lastName }
    }),
    createPost: authorId => ({
      mutation: `
        mutation createPost($authorId: Int!) {
          createPost(authorId: $authorId) {
            id
            authorId
          }
        }
      `,
      variables: { authorId }
    }),
    deleteAuthors: () => ({
      mutation: `
        mutation {
          deleteAuthors {
            id
          }
        }
      `
    })
  }
}

export default connect({
  mapQueriesToProps,
  mapMutationsToProps
})(App)
