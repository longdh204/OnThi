import React, { useEffect, useState } from 'react';
import { Alert, Button, FlatList, Image, SafeAreaView, Text, TextInput, View } from 'react-native';

function App(): React.JSX.Element {
  const [data, setData] = useState([]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [selectedBookId, setSelectedBookId] = useState(null);

  // Hàm lấy danh sách sách
  const fetchBooks = async () => {
    try {
      const response = await fetch("http://10.0.2.2:3000/listBooks");
      const result = await response.json();
      setData(result);
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Hàm tạo hoặc sửa sách
  const saveBook = async () => {
    const url = selectedBookId ? `http://10.0.2.2:3000/updateBook/${selectedBookId}` : "http://10.0.2.2:3000/addBook";
    const method = selectedBookId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ title, price, image: "https://th.bing.com/th/id/OIP.LZrlCkd4SHOqn9lfr4dNvgHaIg?rs=1&pid=ImgDetMain" }).toString(),
      });

      const result = await response.json();
      Alert.alert(result.message);
      await fetchBooks(); // Cập nhật danh sách sau khi tạo/sửa sách
      setSelectedBookId(null); // Reset state sau khi lưu
    } catch (error) {
      console.error(error);
    }
  };

  // Hàm xóa sách
  const deleteBook = async (id) => {
    try {
      const response = await fetch(`http://10.0.2.2:3000/deleteBook/${id}`, { method: "DELETE" });
      const result = await response.json();
      Alert.alert(result.message);
      await fetchBooks(); // Cập nhật danh sách sau khi xóa
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} />
      <TextInput placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" />
      <Button title={selectedBookId ? "Update Book" : "Create Book"} onPress={saveBook} />

      <FlatList
        data={data}
        renderItem={({ item }) => (
          <View>
            <Text>{item.title}</Text>
            <Text>{item.price}</Text>
            <Image source={{ uri: item.image }} style={{ width: 100, height: 100 }} />
            <Button title="Edit" onPress={() => { setSelectedBookId(item._id); setTitle(item.title); setPrice(item.price.toString()); }} />
            <Button title="Delete" onPress={() => deleteBook(item._id)} />
          </View>
        )}
        keyExtractor={(_, index) => index.toString()}
      />
    </SafeAreaView>
  );
}

export default App;
