import { useState, useMemo } from 'react';
import Head from 'next/head'
import Link from 'next/link'
import Date from '../components/date'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'

import { getSortedPostsData } from '../lib/posts'
import Paginate from 'react-paginate';

const PAGE_MAX_ITEMS = 5;

export default function Home({ allPostsData }) {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');

  const filteredPosts = useMemo(() => {
    if (search === '') {      
      return allPostsData;
    }
    return allPostsData.filter((post) => post.title.toLowerCase().includes(search.toLowerCase()))    
  }, [search, allPostsData]);
  
  const handlePageClick = (page) => {
    setPage(page.selected);
  }

  const handleSearch = (e) => {    
    setSearch(e.target.value);
  }

  const totalPage = Math.ceil(filteredPosts.length/PAGE_MAX_ITEMS);
  const paginationOffsetLeft = page * PAGE_MAX_ITEMS;
  const paginationOffsetRight = paginationOffsetLeft + PAGE_MAX_ITEMS;
  
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p >I use this space to share my thoughts around software products with regards to both building them and using them</p>
        <span className={utilStyles.lightText}><a href="https://github.com/rajanpsanthanam">GitHub</a> | <a href="https://twitter.com/rajanpsanthanam">Twitter</a> | <a href="https://www.linkedin.com/in/rajan-santhanam-26864854/">LinkedIn</a></span>
      </section>
      <section className={utilStyles.headingMd}>…</section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <div className="blog-header">
          <h2 className={utilStyles.headingLg}>Blog</h2>
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search"
          />
        </div>     
        {
          search === '' ?
          <ul className={utilStyles.list}>
          {filteredPosts.slice(paginationOffsetLeft, paginationOffsetRight).map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href="/posts/[id]" as={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>        
        :
        <ul className={utilStyles.list}>          
          {filteredPosts.length === 0 ?
          <div className="no-search-message">
            No results found for <i>{search}</i>
          </div>
          :
          filteredPosts.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href="/posts/[id]" as={`/posts/${id}`}>
                <a>{title}</a>
              </Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))
          }
        </ul>        
        }           
      </section>
      {
        search === '' &&
        <div id="react-paginate">
          <Paginate
            previousLabel={'Prev'}
            nextLabel={'Next'}
            breakLabel={'...'}
            breakClassName={'break-me'}
            pageCount={totalPage}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            initialPage={page}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            subContainerClassName={'pages pagination'}
            activeClassName={'active'}
          />
        </div>      
      }
    </Layout>
  )
}


export async function getStaticProps() {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData
    }
  }
}