import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { getUserPosts, getMoreUserPosts, getUserLikePosts, getMoreUserLikePosts } from '../../redux/actions/postsActions'
import useInfiniteScroll from '../../useInfiniteScroll'
import Post from '../Post'
import './FetchingPosts.sass'

function FetchingPosts(props) {

	const references = [
		//get posts
		[ props.getUserPosts ], 
		//get more posts
		[ props.getMoreUserPosts ] 
	]

	let getRefFunction = () => {}
	let getMoreRefFunction = () => {}
	
	references.forEach((mass) => {
		mass.forEach((func) => {
			if (func.name === props.reference) getRefFunction = func
			if (func.name === props.referenceMore) getMoreRefFunction = func
		})
	})

	const [ lastElementRef ] = useInfiniteScroll(
		!!props.posts.length ? getMoreRefFunction : () => {},
		props.isFetching,
		props.username,
		props.lastPost,
		props.complete
	);

	useEffect(() => {
		getRefFunction(props.username)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	},[])

	return (
		<div className="fetch-posts" style={{marginTop: 28}}>
			{ 
				!!props.posts.length ?
				props.posts.map((post, index) => {
					if (props.posts.length === index + 1)  {
						return <Post ref={lastElementRef} post={post} key={index} />
					} else {
						return <Post post={post} key={index} />
					}
				}) : null
			}
			{ props.isFetching && !props.complete && <p>Загрузка...</p> }
		</div>
	)
}

function mapStateToProps(state) {
	return {
		posts: state.posts.posts,
		lastPost: state.posts.lastPost,
		complete: state.posts.complete,
		isFetching: state.posts.isFetching,
		displayName: state.firebase.auth.displayName
	}
}

function mapDispatchToProps(dispatch) {
	return {
		getUserPosts: (username) => dispatch(getUserPosts(username)),
		getMoreUserPosts: (username, lastPost) => dispatch(getMoreUserPosts(username, lastPost)),
		getUserLikePosts: (username) => dispatch(getUserLikePosts(username))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(FetchingPosts)