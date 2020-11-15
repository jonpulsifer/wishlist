# typed: false
# frozen_string_literal: true
class ServicesController < ApplicationController
  skip_before_action :require_login, only: [:ping]

  def ping
    self.response_body = "OK"
  end
end
