export const site = {
  name: 'Kinesiology Notes',
  koreanName: '운동학 노트',
  author: 'Junhyeong Kwon',
  description: '생체역학을 중심으로 사람의 움직임을 공부합니다. 운동 퍼포먼스와 재활, 근골격계 분석과 공학적 접근에 관한 논문과 연구 기록을 나눕니다.',
  naver: 'https://blog.naver.com/itsmekinesiologist',
};
export const categories = [
  { name: '감각-운동', slug: 'sensorimotor', english: 'SENSORIMOTOR', description: '감각과 신경계, 움직임의 조절에 관한 기록', naverId: 7 },
  { name: '스페셜포커스', slug: 'special-focus', english: 'SPECIAL FOCUS', description: '하나의 주제를 자세히 살펴보는 기록', naverId: 10 },
  { name: '부상-질환', slug: 'injury-rehabilitation', english: 'INJURY & REHABILITATION', description: '근골격계 손상과 재활에 관한 기록', naverId: 12 },
];
export const href = (path = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
export const formatDate = (date: Date) => new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'Asia/Seoul' }).format(date);
