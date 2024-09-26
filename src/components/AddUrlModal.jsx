import React, { useState } from 'react';
import axios from 'axios';
import '../style/AddUrlModal.css'; // 모달의 스타일을 정의할 CSS 파일을 임포트하세요

const AddUrlModal = ({ onClose, onSave, categories, onMatchedUrls }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleSave = async () => {
    const userId = localStorage.getItem('userId'); // 사용자 ID를 가져옵니다.
    try {
      const response = await axios.post(
        'http://localhost:5001/api/add-url',
        { title, url, categoryId: selectedCategory },
        { headers: { 'user-id': userId } } // 사용자 ID를 헤더로 전달합니다.
      );

      alert('URL이 성공적으로 추가되었습니다.');

      // onSave를 통해 추가된 URL 데이터를 부모에게 전달
      onSave({ title, url, categoryId: selectedCategory });

      // onMatchedUrls를 호출하여 URL 목록을 업데이트
      onMatchedUrls((prevUrls) => [
        ...prevUrls,
        { id: response.data.id, user_id: userId, title, url }, // response.data.id를 포함
      ]);

      onClose();
    } catch (error) {
      console.error('URL 저장 오류:', error);
      alert('URL 저장 실패');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <h2>Add New URL</h2>
        <div className="modal-field">
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="modal-field">
          <label>URL:</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <div className="modal-field">
          <label>Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button className="modal-save" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default AddUrlModal;
