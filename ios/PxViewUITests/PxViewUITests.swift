//
//  PxViewUITests.swift
//  PxViewUITests
//
//  Created by Jesse Zhu on 2017/11/26.
//  Copyright © 2017年 Facebook. All rights reserved.
//

import XCTest

class PxViewUITests: XCTestCase {
  let app = XCUIApplication()
  let exists = NSPredicate(format: "exists == true")
        
  override func setUp() {
    super.setUp()
  
    // Put setup code here. This method is called before the invocation of each test method in the class.
  
    // In UI tests it is usually best to stop immediately when a failure occurs.
    continueAfterFailure = false
    // UI tests must launch the application that they test. Doing this in setup will make sure it happens for each test method.
    setupSnapshot(app)
    app.launch()

    // In UI tests it’s important to set the initial state - such as interface orientation - required for your tests before they run. The setUp method is a good place to do this.
  }
  
  override func tearDown() {
    // Put teardown code here. This method is called after the invocation of each test method in the class.
    super.tearDown()
  }
  
  func test001Login() {
    // Use recording to get started writing UI tests.
    // Use XCTAssert and related functions to verify your tests produce the correct results.
    sleep(10)
    snapshot("0Launch")
    let usernameField = app.textFields["LoginPageUsernameField"]
    let passwordField = app.secureTextFields["LoginPagePasswordField"]
    let loginBtn = app.otherElements["LoginPageLoginButton"]
    expectation(for: exists, evaluatedWith: usernameField, handler: nil)
    expectation(for: exists, evaluatedWith: passwordField, handler: nil)
    expectation(for: exists, evaluatedWith: loginBtn, handler: nil)
    waitForExpectations(timeout: 10, handler: nil)
    usernameField.tap()
    usernameField.typeText("jesse@itjesse.com")
    passwordField.tap()
    passwordField.typeText("zyb940708")
    loginBtn.tap()
    let tabBtn = app.otherElements["HomeTab"]
    expectation(for: exists, evaluatedWith: tabBtn, handler: nil)
    waitForExpectations(timeout: 10, handler: nil)
  }
  
  func test002ChangeTab() {
    var tabBtn = app.otherElements["HomeTab"]
    expectation(for: exists, evaluatedWith: tabBtn, handler: nil)
    waitForExpectations(timeout: 10, handler: nil)
    tabBtn.tap()
    sleep(5)
//    snapshot("1HomeTab")
    
    tabBtn = app.otherElements["RankingTab"]
    expectation(for: exists, evaluatedWith: tabBtn, handler: nil)
    waitForExpectations(timeout: 10, handler: nil)
    tabBtn.tap()
    snapshot("2RankingTab")
    
    tabBtn = app.otherElements["TrendingTab"]
    expectation(for: exists, evaluatedWith: tabBtn, handler: nil)
    waitForExpectations(timeout: 10, handler: nil)
    tabBtn.tap()
    snapshot("3TrendingTab")

//    tabBtn = app.otherElements["NewWorksTab"]
//    expectation(for: exists, evaluatedWith: tabBtn, handler: nil)
//    waitForExpectations(timeout: 10, handler: nil)
//    tabBtn.tap()
//    snapshot("4NewWorksTab")
//
    tabBtn = app.otherElements["MyPageTab"]
    expectation(for: exists, evaluatedWith: tabBtn, handler: nil)
    waitForExpectations(timeout: 10, handler: nil)
    tabBtn.tap()
    snapshot("6MyPageTab")
  }
  
  func test003Detail() {
    let tabBtn = app.otherElements["NewWorksTab"]
    expectation(for: exists, evaluatedWith: tabBtn, handler: nil)
    waitForExpectations(timeout: 10, handler: nil)
    tabBtn.tap()
    
    let illust = app.otherElements["64163504"]
    expectation(for: exists, evaluatedWith: illust, handler: nil)
    waitForExpectations(timeout: 10, handler: nil)
    illust.tap()
    
    let detail = app.otherElements["Detail"]
    expectation(for: exists, evaluatedWith: detail, handler: nil)
    waitForExpectations(timeout: 10, handler: nil)
    sleep(2)
    snapshot("5Detail")
  }
  
//  func testLogout() {
//    let tabBtn = app.otherElements["MyPageTab"]
//    expectation(for: exists, evaluatedWith: tabBtn, handler: nil)
//    waitForExpectations(timeout: 10, handler: nil)
//    tabBtn.tap()
//
//    let logoutBtn = app.otherElements["LogoutButton"]
//    expectation(for: exists, evaluatedWith: logoutBtn, handler: nil)
//    waitForExpectations(timeout: 10, handler: nil)
//    logoutBtn.tap()
//
//    print(app.alerts)
//    let logoutConfirmBtn = app.otherElements["LogoutConfirmButton"]
//    expectation(for: exists, evaluatedWith: logoutConfirmBtn, handler: nil)
//    waitForExpectations(timeout: 10, handler: nil)
//    logoutConfirmBtn.tap()
//  }
  
}
