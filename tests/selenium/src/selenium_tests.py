import unittest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import os
import time

class SeleniumTestBase(unittest.TestCase):

    BASE_URL = "http://localhost:5173/"
    DRIVER_DIR = os.path.join(os.path.dirname(__file__), '..', 'drivers', 'chromedriver_win64', 'chromedriver.exe')
    WAIT_TIME = 2

    @classmethod
    def setUpClass(cls):
        """Инициализация пути к ChromeDriver для всех тестов."""
        cls.driver_path = cls.find_chromedriver()
        if not cls.driver_path:
            raise FileNotFoundError("ChromeDriver not found. Please place chromedriver in the project directory or ensure it is in the PATH.")

    @staticmethod
    def find_chromedriver():
        """Поиск файла chromedriver в стандартных местах и в PATH."""
        driver_dirs = [
            SeleniumTestBase.DRIVER_DIR
        ]

        for path in driver_dirs:
            if os.path.isfile(path):
                return path

        # Проверка в переменной окружения PATH
        for path in os.environ["PATH"].split(os.pathsep):
            exe_file = os.path.join(path, 'chromedriver.exe')
            if os.path.isfile(exe_file):
                return exe_file

        return None

    def setUp(self):
        """Настройка и запуск веб-драйвера перед каждым тестом."""
        service = ChromeService(executable_path=self.driver_path)
        self.driver = webdriver.Chrome(service=service)
        self.driver.get(self.BASE_URL)
        print(f"Открыт URL: {self.BASE_URL}")

    def tearDown(self):
        """Закрытие веб-драйвера после каждого теста."""
        self.driver.quit()
        print("Закрыт браузер")

    def run_test(self, input_code: str, expected_output: str):
        """Запуск тестового кода в интерпретаторе и проверка ожидаемого результата."""
        self._enter_code(input_code)
        self._execute_code()
        self._verify_output(expected_output)

    def _enter_code(self, code: str):
        """Ввод кода в текстовое поле."""
        input_element = self.driver.find_element(By.ID, "code-editor")
        input_element.send_keys(code + Keys.RETURN)
        print(f"Введен код: {code}")

    def _execute_code(self):
        """Нажатие на кнопку выполнения."""
        execute_button = self.driver.find_element(By.ID, "execute-button")
        execute_button.click()
        print("Нажата кнопка выполнения")

    def _verify_output(self, expected_output: str):
        """Проверка вывода результата выполнения кода."""
        time.sleep(self.WAIT_TIME)  # Небольшая пауза для ожидания выполнения
        result_element = self.driver.find_element(By.ID, "output-field")
        output_text = result_element.text
        print(f"Вывод результата: {output_text}")
        self.assertIn(expected_output, output_text)


class TestInterpreterApp(SeleniumTestBase):

    def test_variable_assignment(self):
        self.run_test("a = 123; print(a);", "123")

    def test_sum_operation(self):
        self.run_test("print(2 + 2);", "4")

    def test_divide_operation(self):
        self.run_test("print(2 / 2);", "1")

    def test_minus_operation(self):
        self.run_test("print(1322 - 12);", "1310")

    def test_multiplication_operation(self):
        self.run_test("print(21 * 7);", "147")

    def test_priority_operations(self):
        self.run_test("print(123 + 2 * 2 - 1);", "126")

    def test_brackets_expression(self):
        self.run_test("print(7 + 2 * (1 - 11));", "-13")

    def test_use_variables_in_assignment(self):
        self.run_test("a = 123; b = a + 1; print(b);", "124")


if __name__ == "__main__":
    unittest.main()
