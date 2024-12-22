import unittest
from selenium import webdriver
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time


class TestInterpreterApp(unittest.TestCase):

    def setUp(self):
        # Инициализация драйвера для Firefox с использованием Service
        service = Service(executable_path="/usr/bin/geckodriver")
        self.driver = webdriver.Firefox(service=service)

    def test_app_in_firefox(self):
        self.run_test()

    def run_test(self):
        driver = self.driver
        driver.get("http://localhost:5173")  # URL вашего приложения
        print("Открыт URL: http://localhost:5173")

        input_element = driver.find_element(By.ID, "code-editor")
        print("Найден элемент ввода кода")

        input_code = "a = 123; print(a);"
        input_element.send_keys(input_code + Keys.RETURN)
        print(f"Введен код: {input_code}")

        execute_button = driver.find_element(By.ID, "execute-button")
        execute_button.click()
        print("Нажата кнопка выполнения")

        # Небольшая пауза, чтобы дождаться вывода результата
        time.sleep(2)

        result_element = driver.find_element(By.ID, "output-field")
        output_text = result_element.text
        print(f"Вывод результата: {output_text}")

        self.assertIn("123", output_text)

    def tearDown(self):
        self.driver.quit()


if __name__ == "__main__":
    unittest.main()
