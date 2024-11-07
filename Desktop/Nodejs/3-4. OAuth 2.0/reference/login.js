const kakaoLoginButton = document.querySelector('#kakao')
const naverLoginButton = document.querySelector('#naver')
const userImage = document.querySelector('img')
const userName = document.querySelector('#user_name')
const logoutButton = document.querySelector('#logout_button')

let currentOAuthService = ''

const kakaoClientId = 'bb932ef99c5d0a48eb773c1216bdd44a'
const redirectURI = 'http://127.0.0.1:5500'
let kakaoAccessToken = ''

const naverClientId = 'ly_IK7ZXcRRtjBW2iz4X'
const naverClientSecret = 'w6F5xTrLLi'
const naverSecret = 'it_is_me'
let naverAccessToken = ''

function renderUserInfo(imgURL, name) {
  userImage.src = imgURL
  userName.textContent = name
}

kakaoLoginButton.onclick = () => {
  location.href = `	https://kauth.kakao.com/oauth/
  authorize?client_id=${kakaoClientId}&
  redirect_uri=${redirectURI}&response_type=code`
}

naverLoginButton.onclick = () => {
    location.href = `https://nid.naver.com/oauth2.0/
    authorize?client_id=${naverClientId}&
    response_type=code&redirect_uri=${redirectURI}&
    state=${naverSecret}`;
}

window.onload = () => {
  const url = new URL(location.href)
  const urlParams = url.searchParams
  const authorizationCode = urlParams.get('code')
  const naverState = urlParams.get('state')

  if (authorizationCode) {
    if (naverState) {
      axios.post('http://localhost:3000/naver/login', { authorizationCode })
        .then(res => {
          naverAccessToken = res.data
          return axios.post('http://localhost:3000/naver/userinfo', {naverAccessToken})
        })
        .then(res => {
          renderUserInfo(res.data.profile_image, res.data.name)
          currentOAuthService = 'naver'
        })
    } else {
      axios.post('http://localhost:3000/kakao/login', { authorizationCode })
        .then(res => {
          kakaoAccessToken = res.data
          return axios.post('http://localhost:3000/kakao/userinfo', {kakaoAccessToken})
        })
        .then(res => {
          renderUserInfo(res.data.profile_image, res.data.nickname)
          currentOAuthService = 'kakao'
        })
    }
  }
}

logoutButton.onclick = () => {
  if (currentOAuthService === 'kakao') {
    axios.delete('http://localhost:3000/kakao/logout', {
      data : {kakaoAccessToken}
    })
      .then(res => {
        {
          console.log(res.data)
          renderUserInfo('', '')
    }})
  } else if (currentOAuthService === 'naver') {
    axios.delete('http://localhost:3000/naver/logout', {
      data : {naverAccessToken}
    })
      .then(res => {
        {
          console.log(res.data)
          renderUserInfo('', '')
    }})
  }

}
