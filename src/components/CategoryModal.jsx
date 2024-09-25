{
  /*modal css 부분 수정 필요ㅠㅠ*/
}

import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../style/Category.css';

Modal.setAppElement('#root');

function CategoryModal({ isOpen, onClose, userId, addCategory, grade }) {
  const [categoryName, setCategoryName] = useState('');

  const modalStyle = {
    content: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#F4F4F4',
      color: 'black',
      borderRadius: '8px',
      maxWidth: '270px',
      maxHeight: '200px',
      margin: 'auto',
      fontSize: '16px',
      fontWeight: 'bold',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      Swal.fire({
        title: '입력 오류!',
        text: '카테고리명을 입력하세요.',
        icon: 'warning',
        confirmButtonText: '확인',
      });
      return;
    }

    console.log('grade!!', grade);
    console.log('UserId:', userId);

    axios
      .post('http://localhost:5001/api/add-category', {
        userId,

        name: categoryName,
        grade,
      })
      .then((response) => {
        console.log(response); // 응답 내용 확인
        if (response.data.success) {
          addCategory(categoryName);
          setCategoryName('');
          Swal.fire({
            title: '성공!',
            text: '카테고리가 성공적으로 추가되었습니다.',
            icon: 'success',
            confirmButtonText: '확인',
          }).then(onClose);
        } else {
          throw new Error('카테고리 추가에 실패했습니다.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        const errorMessage =
          error.response?.data?.error || error.message || '카테고리 추가 실패';

        Swal.fire({
          title: '오류!',
          text: errorMessage.includes('이미 존재하는 카테고리')
            ? '이미 존재하는 카테고리입니다. 다른 이름을 입력하세요.'
            : errorMessage,
          icon: 'error',
          confirmButtonText: '확인',
        });

        console.error(
          '카테고리 추가 실패:',
          error.response?.data || error.message
        );
      });
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={modalStyle}>
      <form onSubmit={handleSubmit}>
        <label className="modal">카테고리 생성</label>
        <br></br>
        <span className="create-category-description1">
          최소 두 글자 이상으로 입력해 주세요
        </span>
        <br></br>
        <span className="create-category-description2">
          중복 이름으로 추가하는 것은 불가능합니다
        </span>
        <br></br>
        <span className="create-category-description3">
          멤버십 등급에 따라 카테고리 개수가 제한됩니다
        </span>
        <br></br>
        <span className="create-category-description4">
          {' '}
          * 더 많은 카테고리를 추가하고 싶다면 멤버십을 이용하세요 *
        </span>
        <br></br>
        <div>
          <input
            type="text"
            style={{
              marginTop: '10px',
              width: '100%',
              maxHeight: '50vh',
              padding: '8px',
              fontSize: '10px',
              borderColor: '#D9D9D9',
            }}
            placeholder="원하는 카테고리명을 입력하세요"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
        </div>
        <div className="button-container">
          <button type="submit" className="add-category-button">
            추가
          </button>
          <button type="button" className="close-button" onClick={onClose}>
            닫기
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default CategoryModal;
