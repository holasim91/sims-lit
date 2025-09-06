import {LitElement, html, css} from 'lit';
import {customElement, state, property, query} from 'lit/decorators.js';

/**
 * @customElement 데코레이터로 커스텀 엘리먼트 등록
 * - 웹 컴포넌트 표준에 따라 태그 이름에는 반드시 하이픈(-)이 포함되어야 함
 * - 브라우저의 customElements.define()과 동일한 기능
 * - HTML에서 <my-counter></my-counter>로 사용 가능
 */
@customElement('my-counter') 
class Counter extends LitElement {
    // static styles: 컴포넌트의 CSS 스타일을 정의
    // - Shadow DOM 내에서만 적용되어 글로벌 CSS와 격리됨
    // - css`` tagged template literal 사용
    static styles = css`
        .plus{
            color: blue
        }
        .minus{
            color: red
        }
        .zero{
            color: black
        }
        .btns button { margin: 5px; }
    `

    // @property(): 외부에서 HTML 속성으로 전달받을 수 있는 반응형 속성
    // - HTML: <my-counter step-number="5"></my-counter>
    // - 값이 변경되면 자동으로 컴포넌트가 re-render됨
    // - 기본값 1로 설정
    @property()
    stepNumber:number = 1

    // @state(): 컴포넌트 내부 상태를 관리하는 반응형 속성
    // - 외부에서 접근할 수 없는 private한 상태
    // - 값이 변경되면 자동으로 컴포넌트가 re-render됨
    // - 카운터의 현재 값을 저장
    @state()
    value = 0
// render(): Lit 컴포넌트의 핵심 메서드
// - 컴포넌트의 HTML 구조를 정의
// - @state나 @property 값이 변경될 때마다 자동으로 호출됨
// - html`` tagged template literal을 반환해야 함
render() {
    // 숫자 값에 따라 CSS 클래스를 반환하는 헬퍼 함수
    function generateValueClass(num:number){
        if(num === 0) return 'zero'
        if(num > 0) return 'plus'
        if(num < 0) return 'minus'
    }
    
    // html`` 템플릿 리터럴로 HTML 구조 정의
    // - ${} 내부에서 JavaScript 표현식 사용 가능
    // - @click, @input 등으로 이벤트 리스너 바인딩
    return html`
        <h1 class=${generateValueClass(this.value)}>${this.value}</h1>
        <div class="btns">
            <button @click=${()=>this.onClickPlus()}>+</button>
            <button @click=${()=>this.onClickMinus()}>-</button>
            <input @input=${this.changeStepNumber} id="step-number" aria-label="Step Number">
            <button @click=${()=>this.onClickReset()}>Reset</button>
        </div>
    `;
}

// @query(): DOM 요소를 선택하여 클래스 프로퍼티에 할당
// - CSS 선택자를 사용하여 Shadow DOM 내의 요소를 찾음
// - document.querySelector()와 유사하지만 Shadow DOM 범위 내에서 동작
// - '!' 연산자는 TypeScript에게 이 값이 undefined가 아님을 알려줌
@query('#step-number')
input!: HTMLInputElement

// 이벤트 핸들러: input 요소의 값이 변경될 때 호출
// - Event 타입의 매개변수를 받음
// - event.target을 HTMLInputElement로 타입 캐스팅
// - 입력값을 숫자로 변환하여 stepNumber에 저장
changeStepNumber(event: Event){
    const input = event.target as HTMLInputElement
    this.stepNumber = Number(input.value)
}

// + 버튼 클릭 핸들러
// - value 상태를 stepNumber만큼 증가
// - @state 데코레이터로 인해 값 변경시 자동으로 re-render됨
onClickPlus(){
    this.value += this.stepNumber
}

// - 버튼 클릭 핸들러
// - value 상태를 stepNumber만큼 감소
onClickMinus(){
    this.value -= this.stepNumber
}

// Reset 버튼 클릭 핸들러
// - value를 0으로 초기화
// - @query로 선택한 input 요소의 값도 빈 문자열로 초기화
onClickReset(){
    this.value = 0
    this.input.value = ''
}
}