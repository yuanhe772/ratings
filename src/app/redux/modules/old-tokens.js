import { 
  getRatingAgency as RatingAgency,
  getTokenERC20 as TokenERC20 
} from '../../services/contracts'

export const TOKENS_FETCHED = 'TOKENS_FETCHED'

const initialState = { data:[{id:'',name:'',addr:''}], numTokens:0 }

const tokens = (state = initialState, action) => {
  switch (action.type) {
  case TOKENS_FETCHED: 
    console.log('tokens fetch',action,state)
    return {
      ...state, 
      data: [...action.data],
      numTokens: action.numTokens
    }
  default:
    return state
  }
}

const tokensFetched = tokens => {
  return {
    type: TOKENS_FETCHED,
    data: tokens.data,
    numTokens: tokens.numTokens
  }
}

export const fetchTokens = () => 
  dispatch => 
    RatingAgency().then((ratingAgency) => {
      ratingAgency.num_tokens()
      .then(result => {
        var numTokens = result.toNumber();
        console.log("result was:",numTokens);
        var numFetch = 0
        var tokensData = []
        for (var i = 0; i < numTokens; i++) {
          ratingAgency.coveredTokenInfo(i).then( raToken => { // idx, addr
            var res = {id:raToken[0].toNumber(),addr:raToken[1]}
            console.log('got address',res)
            TokenERC20(res.addr).then( tokenERC20 => {
              tokenERC20.name().then( name => {
                res.name = name
                tokensData.push(res)
                console.log('got token with name',name)
                if (++numFetch === numTokens) {
                  tokensData.sort( (a,b) => a.id - b.id)  
                  dispatch(tokensFetched({numTokens: numTokens, data: tokensData } ))
                }
              })
            })
          })
        }
        // var tokensData = [{id:0,name:'a'},{id:1,name:'b'},{id:2,name:'c'},{id:3,name:'d'}]

        // console.log('dummy tokens data',tokensData)
        // dispatch(tokensFetched({"numTokens": numTokens, "tokensData": tokensData } ))
      })
      .catch(result => { console.error("Error from server:"  + result); })
    })


export default tokens

